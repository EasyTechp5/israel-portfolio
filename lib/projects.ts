export type Project = {
  slug: string;
  title: string;
  category: Category;
  desc: string;      // what it does
  helps: string;     // what it does for the client
  tools: string[];
  image: string;
};

export type Category =
  | "AI Agents"
  | "Sales & Lead Gen"
  | "Customer Experience"
  | "Finance & Admin"
  | "Industry Solutions"
  | "Content & Marketing";

export const categories: { name: Category | "All"; blurb: string }[] = [
  { name: "All", blurb: "Everything I have built and shipped." },
  { name: "AI Agents", blurb: "Systems that reason, use tools and take action on their own." },
  { name: "Sales & Lead Gen", blurb: "Finding, qualifying and following up on leads without manual work." },
  { name: "Customer Experience", blurb: "Faster, more consistent responses to the people who pay you." },
  { name: "Finance & Admin", blurb: "Invoices, documents and back-office work that runs itself." },
  { name: "Industry Solutions", blurb: "Automation built for the way a specific sector actually works." },
  { name: "Content & Marketing", blurb: "Content pipelines that publish without a person in the loop." },
];

export const projects: Project[] = [
  // ══════════ AI AGENTS ══════════
  {
    slug: "agent-voice-lead-qualification",
    title: "AI Voice Lead Qualification System",
    category: "AI Agents",
    desc: "A voice agent that calls leads, holds a natural conversation, extracts the useful detail from the transcript and files it into a vector database for retrieval.",
    helps: "Qualifies inbound leads by phone around the clock, so your team only speaks to people worth speaking to.",
    tools: ["n8n", "OpenRouter", "Milvus", "OpenAI Embeddings"],
    image: "/images/projects/agent-voice-lead-qualification.jpg",
  },
  {
    slug: "agent-knowledge-base-chatbot",
    title: "Knowledge Base Customer Chatbot",
    category: "AI Agents",
    desc: "A chat agent with persistent memory that answers from your own documentation, remembers the conversation, and emails a human when it cannot resolve something.",
    helps: "Answers the repeat questions that eat your support hours, and escalates cleanly instead of guessing.",
    tools: ["n8n", "Google Gemini", "Postgres", "Gmail"],
    image: "/images/projects/agent-knowledge-base-chatbot.jpg",
  },
  {
    slug: "agent-website-assistant",
    title: "Website AI Assistant",
    category: "AI Agents",
    desc: "An embedded assistant on the EasyTech Academy site that answers visitor questions about programmes and guides them toward enrolling.",
    helps: "Turns passive website traffic into conversations, and captures interest that would otherwise bounce.",
    tools: ["AI Agent", "Web Widget", "Knowledge Base"],
    image: "/images/projects/agent-website-assistant.jpg",
  },
  {
    slug: "agent-whatsapp-chatbot",
    title: "WhatsApp Business Chatbot",
    category: "AI Agents",
    desc: "A WhatsApp agent that handles enquiries in the channel your customers already use, with routing to a human for anything sensitive.",
    helps: "Meets customers where they actually message you, instead of expecting them to use a web form.",
    tools: ["n8n", "WhatsApp API", "LLM"],
    image: "/images/projects/agent-whatsapp-chatbot.jpg",
  },
  {
    slug: "agent-customer-support",
    title: "AI Customer Support Agent",
    category: "AI Agents",
    desc: "A support workflow that classifies each incoming message, drafts a grounded reply, and routes anything it should not handle to a person.",
    helps: "Cuts first-response time from hours to seconds without letting the AI answer things it should not.",
    tools: ["n8n", "LLM", "Email", "Routing Logic"],
    image: "/images/projects/agent-customer-support.jpg",
  },

  // ══════════ SALES & LEAD GEN ══════════
  {
    slug: "sales-lead-generation-agent",
    title: "AI Lead Generation Agent",
    category: "Sales & Lead Gen",
    desc: "An agent that sources prospects matching your ideal customer profile, enriches each record and pushes qualified leads into your pipeline.",
    helps: "Keeps the top of your funnel filled without anyone spending mornings on manual research.",
    tools: ["n8n", "LLM", "Enrichment APIs", "CRM"],
    image: "/images/projects/sales-lead-generation-agent.jpg",
  },
  {
    slug: "sales-prospecting-pipeline",
    title: "Automated Prospecting Pipeline",
    category: "Sales & Lead Gen",
    desc: "A Lusha-powered pipeline that finds contact data, verifies it, and feeds a sequenced outreach campaign automatically.",
    helps: "Replaces the copy-paste loop between a data tool, a spreadsheet and your outreach platform.",
    tools: ["n8n", "Lusha", "CRM", "Email"],
    image: "/images/projects/sales-prospecting-pipeline.jpg",
  },
  {
    slug: "sales-real-estate-leads",
    title: "Real Estate Lead Generation",
    category: "Sales & Lead Gen",
    desc: "Captures property enquiries, scores them against buying signals and routes hot leads to an agent while nurturing the rest.",
    helps: "Makes sure the serious buyer gets a call in minutes rather than sitting in an inbox.",
    tools: ["n8n", "LLM", "CRM", "Email"],
    image: "/images/projects/sales-real-estate-leads.jpg",
  },

  // ══════════ CUSTOMER EXPERIENCE ══════════
  {
    slug: "cx-customer-feedback",
    title: "AI Customer Feedback Analysis",
    category: "Customer Experience",
    desc: "Collects feedback from every channel, scores sentiment, groups recurring themes and flags anything negative straight away.",
    helps: "Tells you what customers actually keep complaining about, instead of leaving it buried in a spreadsheet.",
    tools: ["n8n", "LLM", "Sentiment Analysis", "Database"],
    image: "/images/projects/cx-customer-feedback.jpg",
  },
  {
    slug: "cx-business-email-responses",
    title: "Automated Business Email Responses",
    category: "Customer Experience",
    desc: "Reads incoming business email, works out intent, and drafts or sends a contextual reply based on rules you control.",
    helps: "Clears the routine half of your inbox so the messages that need judgement get proper attention.",
    tools: ["n8n", "Gmail", "LLM"],
    image: "/images/projects/cx-business-email-responses.jpg",
  },
  {
    slug: "cx-automated-email-replies",
    title: "Automated Email Reply System",
    category: "Customer Experience",
    desc: "A reply system that personalises each response from customer records rather than sending an obvious template.",
    helps: "Gives every enquirer a fast, personal answer even when volume spikes.",
    tools: ["n8n", "Email", "LLM", "Database"],
    image: "/images/projects/cx-automated-email-replies.jpg",
  },

  // ══════════ FINANCE & ADMIN ══════════
  {
    slug: "ops-invoice-processing",
    title: "Automated Invoice Processing",
    category: "Finance & Admin",
    desc: "Reads incoming invoices, extracts vendor, amount and date, validates the figures and writes them into your accounting system.",
    helps: "Removes manual data entry from accounts payable and the typing errors that come with it.",
    tools: ["n8n", "Document AI", "Accounting API"],
    image: "/images/projects/ops-invoice-processing.jpg",
  },
  {
    slug: "ops-invoice-generation",
    title: "Invoice Generation & Delivery",
    category: "Finance & Admin",
    desc: "Generates the invoice on project completion, sends it, tracks payment status and chases on a schedule.",
    helps: "Gets invoices out the day work finishes and chases them without anyone feeling awkward.",
    tools: ["n8n", "PDF Generation", "Email", "Database"],
    image: "/images/projects/ops-invoice-generation.jpg",
  },
  {
    slug: "ops-client-onboarding",
    title: "Automated Client Onboarding",
    category: "Finance & Admin",
    desc: "One trigger fires the whole sequence: folders created, welcome email sent, kickoff call scheduled, intake form delivered, team notified.",
    helps: "Turns a three-hour onboarding checklist into something nobody has to remember.",
    tools: ["n8n", "Google Workspace", "Email", "Calendar"],
    image: "/images/projects/ops-client-onboarding.jpg",
  },
  {
    slug: "ops-document-from-template",
    title: "Document Generation from Templates",
    category: "Finance & Admin",
    desc: "Merges record data into a branded template and produces a finished contract, proposal or report ready to send.",
    helps: "Ends the copy-paste-and-hope-you-changed-the-name approach to producing documents.",
    tools: ["n8n", "Google Docs", "Templates"],
    image: "/images/projects/ops-document-from-template.jpg",
  },
  {
    slug: "ops-meeting-notes",
    title: "Meeting Notes & Action Items",
    category: "Finance & Admin",
    desc: "Turns a meeting into a structured Google Doc with decisions, owners and next steps, then distributes it.",
    helps: "Means the decisions actually get written down, and everyone sees the same version.",
    tools: ["n8n", "Google Docs", "LLM", "Calendar"],
    image: "/images/projects/ops-meeting-notes.jpg",
  },
  {
    slug: "ops-adobe-commerce-sync",
    title: "Adobe Commerce Data Sync",
    category: "Finance & Admin",
    desc: "Moves product, order and customer data between Adobe Commerce and the other systems that need it, with validation on the way through.",
    helps: "Keeps your store and back office in agreement without a nightly manual export.",
    tools: ["n8n", "Adobe Commerce", "REST APIs"],
    image: "/images/projects/ops-adobe-commerce-sync.jpg",
  },

  // ══════════ INDUSTRY SOLUTIONS ══════════
  {
    slug: "industry-healthcare",
    title: "Healthcare Workflow Automation",
    category: "Industry Solutions",
    desc: "Automates patient scheduling, reminders and record updates, with a human checkpoint anywhere clinical judgement is involved.",
    helps: "Reduces no-shows and admin load while keeping people in the loop where it matters.",
    tools: ["n8n", "Calendar", "Notifications", "Database"],
    image: "/images/projects/industry-healthcare.jpg",
  },
  {
    slug: "industry-hotel-booking",
    title: "AI-Powered Hotel Booking",
    category: "Industry Solutions",
    desc: "Handles booking enquiries, checks availability, confirms reservations and sends pre-arrival information automatically.",
    helps: "Captures bookings at 2am and stops enquiries going cold overnight.",
    tools: ["n8n", "LLM", "Booking API", "Email"],
    image: "/images/projects/industry-hotel-booking.jpg",
  },
  {
    slug: "industry-real-estate",
    title: "AI-Powered Real Estate System",
    category: "Industry Solutions",
    desc: "An end-to-end property workflow covering listings, enquiry handling, viewing scheduling and follow-up.",
    helps: "Keeps every enquiry moving toward a viewing instead of relying on someone remembering to chase.",
    tools: ["n8n", "LLM", "CRM", "Calendar"],
    image: "/images/projects/industry-real-estate.jpg",
  },
  {
    slug: "industry-recruitment",
    title: "AI Recruitment Automation",
    category: "Industry Solutions",
    desc: "Screens applications against role criteria, ranks candidates, schedules interviews and keeps applicants informed.",
    helps: "Gets you to a shortlist quickly, and means no candidate is left without a reply.",
    tools: ["n8n", "LLM", "ATS", "Calendar"],
    image: "/images/projects/industry-recruitment.jpg",
  },
  {
    slug: "industry-student-enrollment",
    title: "AI Student Enrollment System",
    category: "Industry Solutions",
    desc: "Runs the enrolment pipeline: registration, unique student ID generation, payment confirmation, receipts and cohort communication.",
    helps: "Lets a training business take on a bigger cohort without adding admin staff.",
    tools: ["n8n", "Database", "Email", "Payments"],
    image: "/images/projects/industry-student-enrollment.jpg",
  },
  {
    slug: "industry-sales-forecasting",
    title: "AI Sales Forecasting",
    category: "Industry Solutions",
    desc: "Pulls historical sales and pipeline data, generates forecasts and flags the trends worth acting on.",
    helps: "Gives you a forward view of revenue without rebuilding the same spreadsheet every month.",
    tools: ["n8n", "LLM", "Data Pipeline", "Dashboards"],
    image: "/images/projects/industry-sales-forecasting.jpg",
  },

  // ══════════ CONTENT & MARKETING ══════════
  {
    slug: "content-ai-creation",
    title: "AI Content Creation Pipeline",
    category: "Content & Marketing",
    desc: "Generates on-brand content from a brief, routes it for approval, and publishes to the right channels on schedule.",
    helps: "Keeps publishing consistent even in the weeks when nobody has time to write.",
    tools: ["n8n", "LLM", "CMS", "Social APIs"],
    image: "/images/projects/content-ai-creation.jpg",
  },
];

export function byCategory(cat: string): Project[] {
  return cat === "All" ? projects : projects.filter((p) => p.category === cat);
}

export function categoryCount(cat: string): number {
  return byCategory(cat).length;
}
