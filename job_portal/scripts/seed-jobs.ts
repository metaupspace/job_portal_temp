import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const FieldDefinitionSchema = new mongoose.Schema(
  {
    fieldId: { type: String, required: true },
    label: { type: String, required: true },
    fieldType: {
      type: String,
      required: true,
      enum: ['text', 'textarea', 'select', 'boolean', 'number'],
    },
    required: { type: Boolean, default: false },
    options: { type: [String], default: [] },
  },
  { _id: false },
);

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    domain: { type: String, required: true },
    type: { type: String, required: true, enum: ['tech', 'non-tech'] },
    isActive: { type: Boolean, default: true },
    requirements: { type: [String], default: [] },
    customFields: { type: [FieldDefinitionSchema], default: [] },
  },
  { timestamps: true },
);

const jobs = [
  {
    title: 'Frontend Engineer',
    slug: 'frontend-engineer',
    description:
      'Build responsive, accessible user interfaces using React and TypeScript. Collaborate with designers and backend engineers to ship product features end-to-end.',
    domain: 'Engineering',
    type: 'tech',
    isActive: true,
    requirements: [
      '2+ years of experience with React',
      'Strong TypeScript fundamentals',
      'Experience with modern CSS (Tailwind, CSS-in-JS)',
      'Familiarity with REST APIs and async data flows',
    ],
    customFields: [
      {
        fieldId: 'portfolio_url',
        label: 'Portfolio / GitHub URL',
        fieldType: 'text',
        required: true,
        options: [],
      },
      {
        fieldId: 'years_experience',
        label: 'Years of frontend experience',
        fieldType: 'number',
        required: true,
        options: [],
      },
      {
        fieldId: 'preferred_framework',
        label: 'Preferred framework',
        fieldType: 'select',
        required: false,
        options: ['React', 'Vue', 'Svelte', 'Angular'],
      },
    ],
  },
  {
    title: 'Backend Engineer (Node.js)',
    slug: 'backend-engineer-nodejs',
    description:
      'Design and build scalable backend services using Node.js, NestJS, and MongoDB. Own services from API design through deployment and monitoring.',
    domain: 'Engineering',
    type: 'tech',
    isActive: true,
    requirements: [
      '3+ years building production Node.js services',
      'Experience with NestJS or similar frameworks',
      'Comfortable with MongoDB or PostgreSQL',
      'Understanding of authentication, caching, and queues',
    ],
    customFields: [
      {
        fieldId: 'github_url',
        label: 'GitHub profile',
        fieldType: 'text',
        required: true,
        options: [],
      },
      {
        fieldId: 'open_to_oncall',
        label: 'Open to on-call rotation?',
        fieldType: 'boolean',
        required: true,
        options: [],
      },
    ],
  },
  {
    title: 'Full Stack Developer',
    slug: 'full-stack-developer',
    description:
      'Work across the stack — from React frontends to Node.js APIs and MongoDB schemas. Ship features end-to-end on a small, fast-moving team.',
    domain: 'Engineering',
    type: 'tech',
    isActive: true,
    requirements: [
      'Experience with React and Node.js in production',
      'Comfortable owning features end-to-end',
      'Familiarity with MongoDB schema design',
      'Good communication and product sense',
    ],
    customFields: [
      {
        fieldId: 'portfolio_url',
        label: 'Portfolio URL',
        fieldType: 'text',
        required: true,
        options: [],
      },
      {
        fieldId: 'preferred_stack',
        label: 'Preferred stack',
        fieldType: 'select',
        required: false,
        options: ['MERN', 'Next.js + Postgres', 'NestJS + React', 'Other'],
      },
    ],
  },
  {
    title: 'DevOps Engineer',
    slug: 'devops-engineer',
    description:
      'Own CI/CD, infrastructure as code, and observability. Help engineers ship safely and quickly to production.',
    domain: 'Infrastructure',
    type: 'tech',
    isActive: true,
    requirements: [
      'Hands-on experience with AWS or GCP',
      'Proficient with Docker and Kubernetes',
      'Comfortable scripting with Bash and Python',
      'Experience with GitHub Actions or similar CI tools',
    ],
    customFields: [
      {
        fieldId: 'cloud_provider',
        label: 'Primary cloud provider',
        fieldType: 'select',
        required: true,
        options: ['AWS', 'GCP', 'Azure', 'Other'],
      },
    ],
  },
  {
    title: 'UI/UX Designer',
    slug: 'ui-ux-designer',
    description:
      'Design clean, intuitive interfaces for our web product. Partner closely with engineering to ensure designs ship pixel-perfect.',
    domain: 'Design',
    type: 'non-tech',
    isActive: true,
    requirements: [
      'Strong portfolio of shipped product work',
      'Proficiency in Figma',
      'Understanding of design systems and accessibility',
    ],
    customFields: [
      {
        fieldId: 'portfolio_url',
        label: 'Portfolio URL',
        fieldType: 'text',
        required: true,
        options: [],
      },
      {
        fieldId: 'figma_proficiency',
        label: 'Figma proficiency',
        fieldType: 'select',
        required: true,
        options: ['Beginner', 'Intermediate', 'Advanced'],
      },
    ],
  },
  {
    title: 'Product Manager',
    slug: 'product-manager',
    description:
      'Own product strategy and roadmap for a key surface area. Work with engineering, design, and leadership to ship outcomes that move the business.',
    domain: 'Product',
    type: 'non-tech',
    isActive: true,
    requirements: [
      '3+ years of product management experience',
      'Track record of shipping consumer or B2B products',
      'Strong written and verbal communication',
    ],
    customFields: [
      {
        fieldId: 'why_metaupspace',
        label: 'Why MetaUpSpace?',
        fieldType: 'textarea',
        required: true,
        options: [],
      },
    ],
  },
  {
    title: 'Marketing Associate',
    slug: 'marketing-associate',
    description:
      'Drive content, social, and growth campaigns. Help shape our brand voice and reach new audiences.',
    domain: 'Marketing',
    type: 'non-tech',
    isActive: true,
    requirements: [
      '1-3 years of marketing experience',
      'Strong writing skills',
      'Comfortable with analytics tools',
    ],
    customFields: [
      {
        fieldId: 'sample_work',
        label: 'Link to sample work / campaigns',
        fieldType: 'text',
        required: false,
        options: [],
      },
    ],
  },
  {
    title: 'HR & People Operations',
    slug: 'hr-people-operations',
    description:
      'Lead hiring, onboarding, and people programs. Help build a culture where great people do their best work.',
    domain: 'People',
    type: 'non-tech',
    isActive: false,
    requirements: [
      '2+ years in HR or recruiting',
      'Experience with ATS tools',
      'Strong interpersonal skills',
    ],
    customFields: [],
  },
];

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not set in .env');
    process.exit(1);
  }

  await mongoose.connect(uri);
  const JobModel = mongoose.model('Job', JobSchema);

  let inserted = 0;
  let updated = 0;

  for (const job of jobs) {
    const slug = job.slug ?? slugify(job.title);
    const existing = await JobModel.findOne({ slug });
    await JobModel.findOneAndUpdate(
      { slug },
      { ...job, slug },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    if (existing) {
      updated++;
    } else {
      inserted++;
    }
    console.log(`  ${existing ? '↻ updated' : '+ inserted'}  ${job.title}`);
  }

  await mongoose.disconnect();

  console.log(`\n✓ Done. ${inserted} inserted, ${updated} updated.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
