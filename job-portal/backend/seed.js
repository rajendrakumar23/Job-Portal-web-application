import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobportal';

const userSchema = new mongoose.Schema({ name: String, email: String, password: String, role: String }, { timestamps: true });
const jobSchema = new mongoose.Schema({
  title: String, company: String, location: String, type: String, category: String,
  description: String, requirements: [String], responsibilities: [String],
  salaryMin: Number, salaryMax: Number, experience: String, skills: [String],
  postedBy: mongoose.Schema.Types.ObjectId, isActive: Boolean, applicationsCount: Number
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);

const SAMPLE_JOBS = [
  {
    title: 'Senior React Developer', company: 'TechCorp India', location: 'Bengaluru, Karnataka',
    type: 'Full-time', category: 'Technology', experience: '3-5 years',
    salaryMin: 1200000, salaryMax: 2000000,
    description: 'We are looking for a Senior React Developer to join our growing team...',
    requirements: ["3+ years React experience", "TypeScript proficiency", "Redux/Zustand knowledge"],
    responsibilities: ["Build scalable frontend applications", "Mentor junior developers", "Code reviews"],
    skills: ['React', 'TypeScript', 'Redux', 'Node.js', 'MongoDB'], isActive: true, applicationsCount: 24
  },
  {
    title: 'UI/UX Designer', company: 'DesignHub', location: 'Remote',
    type: 'Remote', category: 'Design', experience: '1-2 years',
    salaryMin: 600000, salaryMax: 1200000,
    description: 'Join our design team to craft beautiful digital experiences...',
    requirements: ["2+ years design experience", "Figma proficiency", "Portfolio required"],
    responsibilities: ["Design user interfaces", "Conduct user research", "Create prototypes"],
    skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'], isActive: true, applicationsCount: 15
  },
  {
    title: 'Data Analyst', company: 'DataWave Analytics', location: 'Mumbai, Maharashtra',
    type: 'Full-time', category: 'Technology', experience: '1-2 years',
    salaryMin: 700000, salaryMax: 1200000,
    description: 'Analyze large datasets and provide actionable insights...',
    requirements: ["Python/R proficiency", "SQL expertise", "Tableau/Power BI"],
    responsibilities: ["Analyze business data", "Create dashboards", "Present findings"],
    skills: ['Python', 'SQL', 'Tableau', 'Excel', 'Statistics'], isActive: true, applicationsCount: 18
  },
  {
    title: 'Marketing Manager', company: 'GrowthBridge', location: 'Delhi, NCR',
    type: 'Full-time', category: 'Marketing', experience: '3-5 years',
    salaryMin: 900000, salaryMax: 1500000,
    description: 'Lead our marketing team to drive brand growth...',
    requirements: ["5+ years marketing", "Digital marketing expertise", "Team management"],
    responsibilities: ["Develop marketing strategies", "Manage campaigns", "Analyze performance"],
    skills: ['Digital Marketing', 'SEO', 'Google Ads', 'Analytics', 'Content Strategy'], isActive: true, applicationsCount: 9
  },
  {
    title: 'Backend Engineer (Node.js)', company: 'CloudScale Technologies', location: 'Hyderabad, Telangana',
    type: 'Full-time', category: 'Technology', experience: '3-5 years',
    salaryMin: 1400000, salaryMax: 2200000,
    description: 'Build high-performance backend services and APIs...',
    requirements: ["3+ years Node.js", "MongoDB/PostgreSQL", "REST/GraphQL APIs", "AWS/GCP experience"],
    responsibilities: ["Design microservices", "Optimize database queries", "API development"],
    skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS'], isActive: true, applicationsCount: 31
  },
  {
    title: 'Product Manager', company: 'InnovateTech', location: 'Pune, Maharashtra',
    type: 'Full-time', category: 'Technology', experience: '5+ years',
    salaryMin: 2000000, salaryMax: 3500000,
    description: 'Drive product vision and strategy for our flagship SaaS platform...',
    requirements: ["5+ years PM experience", "B2B SaaS background", "Technical background preferred"],
    responsibilities: ["Define product roadmap", "Work with engineering teams", "Stakeholder management"],
    skills: ['Product Strategy', 'Agile', 'JIRA', 'Analytics', 'User Research'], isActive: true, applicationsCount: 7
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  await User.deleteMany({});
  await Job.deleteMany({});
  console.log('🧹 Cleared existing data');

  const adminPw = await bcrypt.hash('admin123', 12);
  const userPw = await bcrypt.hash('user1234', 12);

  const admin = await User.create({
    name: 'Admin User', email: 'admin@jobsphere.com',
    password: adminPw, role: 'admin'
  });

  await User.create({
    name: 'Riya Sharma', email: 'user@jobsphere.com',
    password: userPw, role: 'user'
  });

  console.log('👤 Created users');

  for (const job of SAMPLE_JOBS) {
    await Job.create({ ...job, postedBy: admin._id });
  }

  console.log(`💼 Created ${SAMPLE_JOBS.length} sample jobs`);
  console.log('\n🎉 Seed complete!\n');
  console.log('Admin:  admin@jobsphere.com  / admin123');
  console.log('User:   user@jobsphere.com   / user1234');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => { console.error('❌ Seed failed:', err); process.exit(1); });
