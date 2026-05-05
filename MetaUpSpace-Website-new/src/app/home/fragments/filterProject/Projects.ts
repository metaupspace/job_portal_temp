// projectData.ts

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  features: string[];
}

export const projectsData: Project[] = [
  // --- UI/UX Design (category: uiux) ---
  {
    id: '1',
    title: 'UI/Ux for Web Applications',
    description: 'User-centered interface design optimized for modern web browsers and responsive layouts.',
    category: 'uiux',
    imageUrl: '/Industry/WebUI.png',
    features: ['User Research', 'Wireframing', 'Interactive Prototypes', 'Usability Testing']
  },
  {
    id: '2',
    title: 'UI/Ux for Mobile Applications',
    description: 'Intuitive mobile-first designs adhering to iOS Human Interface and Material Design guidelines.',
    category: 'uiux',
    imageUrl: '/Industry/WebApp.png',
    features: ['Touch Interactions', 'Native Patterns', 'Gesture Controls', 'App Store Assets']
  },
  {
    id: '3',
    title: 'UI/UX for Custom Software',
    description: 'Specialized dashboard and workflow designs for complex proprietary software systems.',
    category: 'uiux',
    imageUrl: '/Industry/WebCustom.png',
    features: ['Complex Workflows', 'Data Visualization', 'Dashboard Design', 'Accessibility Compliance']
  },

  // --- Website Development (category: web) ---
  {
    id: '4',
    title: 'Ecommerce Store',
    description: 'Full-featured online retail platforms built for sales conversion and inventory management.',
    category: 'web',
    imageUrl: '/mockup/bid.png',
    features: ['Product Catalog', 'Shopping Cart', 'Payment Gateway', 'Order Management']
  },
  {
    id: '5',
    title: 'Landing Page',
    description: 'High-conversion single-page websites designed for specific marketing campaigns.',
    category: 'web',
    imageUrl: '/mockup/byte.png',
    features: ['Lead Capture', 'SEO Optimization', 'A/B Testing Ready', 'Fast Loading']
  },
  {
    id: '6',
    title: 'Blog',
    description: 'Content-focused platforms with robust editorial tools and reader engagement features.',
    category: 'web',
    imageUrl: '/Industry/blog.png',
    features: ['CMS Integration', 'Comment System', 'Social Sharing', 'Newsletter Signup']
  },
  {
    id: '7',
    title: 'CMS (Content Management System)',
    description: 'Customizable platforms allowing non-technical users to manage website content easily.',
    category: 'web',
    imageUrl: '/Industry/cms.png',
    features: ['Admin Dashboard', 'Role Management', 'Media Library', 'Dynamic Content']
  },
  {
    id: '8',
    title: 'SaaS Application',
    description: 'Scalable cloud-based software delivery models with subscription management.',
    category: 'web',
    imageUrl: '/Industry/saas.png',
    features: ['User Authentication', 'Subscription Billing', 'Multi-tenancy', 'API Access']
  },
  {
    id: '9',
    title: 'Marketplace',
    description: 'Multi-vendor platforms connecting buyers and sellers in a unified ecosystem.',
    category: 'web',
    imageUrl: '/hero/project.png',
    features: ['Vendor Portals', 'Commission System', 'Ratings & Reviews', 'Search & Filtering']
  },
  {
    id: '10',
    title: 'Corporate Website',
    description: 'Professional business presence focusing on brand identity and company information.',
    category: 'web',
    imageUrl: '/Industry/WebCustom.png',
    features: ['Company Portfolio', 'Team Profiles', 'Career Section', 'Investor Relations']
  },
  {
    id: '11',
    title: 'Custom Web Application',
    description: 'Tailored web solutions built to address specific business problems and workflows.',
    category: 'web',
    imageUrl: '/Industry/WebUI.png',
    features: ['Custom Logic', 'Database Design', 'Third-party Integrations', 'Secure Login']
  },

  // --- Mobile App (category: mobile) ---
  {
    id: '12',
    title: 'Android Application',
    description: 'Native Android apps optimized for the diverse ecosystem of Android devices.',
    category: 'mobile',
    imageUrl: '/mockup/pharmansh.png',
    features: ['Material Design', 'Google Play Publish', 'Background Services', 'Widget Support']
  },
  {
    id: '13',
    title: 'IOS Application',
    description: 'Premium native iOS applications built with Swift for iPhone and iPad.',
    category: 'mobile',
    imageUrl: '/mockup/byte.png',
    features: ['Apple Ecosystem', 'FaceID Integration', 'App Store Optimization', 'Smooth Animations']
  },
  {
    id: '14',
    title: 'Cross-platform Mobile Application',
    description: 'Efficient hybrid apps that run seamlessly on both iOS and Android from a single codebase.',
    category: 'mobile',
    imageUrl: '/Industry/cross.png',
    features: ['React Native/Flutter', 'Single Codebase', 'Cost Effective', 'Rapid Deployment']
  },

  // --- Automation (category: automation) ---
  {
    id: '15',
    title: 'CRM Automation',
    description: 'Automated workflows to manage customer interactions and streamline sales pipelines.',
    category: 'automation',
    imageUrl: '/Industry/auto1.png',
    features: ['Auto-logging', 'Follow-up Reminders', 'Contact Sync', 'Pipeline Tracking']
  },
  {
    id: '16',
    title: 'Marketing Automation',
    description: 'Systems to automate repetitive marketing tasks across multiple channels.',
    category: 'automation',
    imageUrl: '/Industry/auto2.png',
    features: ['Email Campaigns', 'Social Media Scheduling', 'Lead Nurturing', 'Campaign Analytics']
  },
  {
    id: '17',
    title: 'Sales Automation',
    description: 'Tools to accelerate the sales process by automating manual data entry and tasks.',
    category: 'automation',
    imageUrl: '/Industry/auto3.png',
    features: ['Quote Generation', 'Contract Signatures', 'Meeting Scheduling', 'Sales Forecasting']
  },
  {
    id: '18',
    title: 'Operations Automation',
    description: 'Streamlining internal business operations to improve efficiency and reduce errors.',
    category: 'automation',
    imageUrl:  '/Industry/auto1.png',
    features: ['Inventory Sync', 'Task Assignment', 'Report Generation', 'Process Triggers']
  },
  {
    id: '19',
    title: 'Customer Service Automation',
    description: 'AI-driven solutions to handle customer inquiries and support tickets instantly.',
    category: 'automation',
    imageUrl: '/Industry/auto4.png',
    features: ['Chatbots', 'Ticket Routing', 'Auto-responses', 'Knowledge Base']
  },
  {
    id: '20',
    title: 'Financial Process Automation',
    description: 'Automating accounting tasks, invoicing, and expense reporting.',
    category: 'automation',
   imageUrl: '/Industry/auto3.png',
    features: ['Invoice Generation', 'Expense Tracking', 'Payment Reconciliation', 'Tax Calculations']
  },
  {
    id: '21',
    title: 'HR & Recruitment Automation',
    description: 'Tools to automate candidate screening, onboarding, and employee management.',
    category: 'automation',
    imageUrl: '/Industry/auto5.png',
    features: ['Resume Parsing', 'Interview Scheduling', 'Onboarding Flows', 'Leave Management']
  },
  {
    id: '22',
    title: 'E-commerce Automation',
    description: 'Automated triggers for cart abandonment, order updates, and customer retention.',
    category: 'automation',
  imageUrl: '/Industry/auto4.png',
    features: ['Abandoned Cart Emails', 'Stock Alerts', 'Dynamic Pricing', 'Review Requests']
  },
  {
    id: '23',
    title: 'Workflow Automation',
    description: 'Connecting disparate apps to create seamless data flows between systems.',
    category: 'automation',
    imageUrl:  '/Industry/auto1.png',
    features: ['Zapier/Make Integration', 'Custom Webhooks', 'Cross-app Data', 'Event Triggers']
  },
  {
    id: '24',
    title: 'Data Integration',
    description: 'Unifying data from various sources into a single source of truth automatically.',
    category: 'automation',
    imageUrl: '/Industry/auto6.png',
    features: ['ETL Processes', 'API Connectors', 'Real-time Sync', 'Data Warehousing']
  },

  // --- Custom Software (category: Custom) ---
  {
    id: '25',
    title: 'Enterprise Software',
    description: 'Large-scale software solutions designed for organization-wide needs.',
    category: 'Custom',
    imageUrl: '/mockup/bid.png',
    features: ['High Security', 'Scalable Architecture', 'Legacy Integration', 'Audit Logs']
  },
  {
    id: '26',
    title: 'Saas Tool',
    description: 'Proprietary software tools built to solve niche market problems.',
    category: 'Custom',
    imageUrl: '/Industry/cms.png',
    features: ['Subscription Logic', 'User Dashboards', 'Cloud Hosting', 'Feature Gating']
  },
  {
    id: '27',
    title: 'Custom CRM',
    description: 'Relationship management systems built specifically for your unique sales process.',
    category: 'Custom',
    imageUrl: '/Industry/cross.png',
    features: ['Custom Fields', 'Unique Workflows', 'Specific Reporting', 'Client Portal']
  },
  {
    id: '28',
    title: 'ERP (Enterprise Resource Planning)',
    description: 'Integrated management of main business processes, often in real-time.',
    category: 'Custom',
    imageUrl: '/mockup/byte.png',
    features: ['Supply Chain', 'Financials', 'HR Modules', 'Manufacturing']
  },
  {
    id: '29',
    title: 'Desktop Application',
    description: 'Software installed directly on personal computers for offline or high-performance tasks.',
    category: 'Custom',
    imageUrl: '/Industry/cms.png',
    features: ['Offline Access', 'System Hardware Access', 'High Performance', 'Local Storage']
  },
  {
    id: '30',
    title: 'Cloud-based Software',
    description: 'Software hosted on remote servers, accessible via the internet from anywhere.',
    category: 'Custom',
    imageUrl: '/mockup/pharmansh.png',
    features: ['AWS/Azure/GCP', 'Auto-scaling', 'Remote Access', 'Data Redundancy']
  }
];
