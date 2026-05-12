import { useState } from "react";

import api from "../../utils/api";

import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const ResumeAnalyzer = () => {

  const [file, setFile] = useState(null);

  const [result, setResult] = useState("");

  const [loading, setLoading] = useState(false);

  const extractTextFromPDF = async (file) => {

    const arrayBuffer =
      await file.arrayBuffer();

    const pdf =
      await pdfjsLib.getDocument({
        data: arrayBuffer,
      }).promise;

    let text = "";

    for (
      let i = 1;
      i <= pdf.numPages;
      i++
    ) {

      const page =
        await pdf.getPage(i);

      const content =
        await page.getTextContent();

      const strings =
        content.items.map(
          (item) => item.str
        );

      text += strings.join(" ");
    }

    return text;
  };

  const handleAnalyze = async () => {

    if (!file) {

      alert("Select PDF resume");

      return;
    }

    try {

      setLoading(true);

      const resumeText =
        await extractTextFromPDF(file);

      const res = await api.post(
        "/ai/analyze-text-resume",
        {
          resumeText,
        }
      );

      setResult(res.data.analysis);

    } catch (error) {

      console.log(error);

      setResult(
        "Failed to analyze resume"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xl">

      <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
        AI Resume Analyzer
      </h2>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) =>
          setFile(e.target.files[0])
        }
        className="mb-4"
      />

      <button
        type="button"
        onClick={handleAnalyze}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
      >

        {loading
          ? "Analyzing..."
          : "Analyze Resume"}

      </button>

      {result && (
        <div className="mt-5 whitespace-pre-wrap bg-slate-50 dark:bg-zinc-800 p-4 rounded-xl text-sm text-slate-700 dark:text-slate-300">
          {result}
        </div>
      )}

    </div>
  );
};

export default ResumeAnalyzer;