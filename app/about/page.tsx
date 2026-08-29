import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MessageCircle, ArrowRight, CheckCircle2, Quote } from "lucide-react";

export const metadata: Metadata = {
  title: "About | Israel Afolabi",
  description: "Learn about Israel Afolabi — AI Automation Specialist and Founder of EasyTech Academy, helping businesses automate operations and professionals build AI skills.",
};

const credentials = [
  "AI & Automation Specialist (3+ years)",
  "Founder, EasyTech Academy",
  "1500+ individuals trained",
  "10+ organizations consulted",
  "Expert in n8n, Make.com & Claude AI",
  "Google Apps Script practitioner",
  "Trusted by teams across multiple industries",
];

const tools = [
  { name: "n8n", cat: "Automation", color: "bg-[#1e3a8a]/20 text-[#bdd0fb] border-[#3b5fc0]/30" },
  { name: "Make.com", cat: "Automation", color: "bg-[#1e3a8a]/20 text-[#bdd0fb] border-[#3b5fc0]/30" },
  { name: "Claude AI", cat: "AI", color: "bg-purple-500/10 text-purple-300 border-purple-500/20" },
  { name: "ChatGPT", cat: "AI", color: "bg-purple-500/10 text-purple-300 border-purple-500/20" },
  { name: "Google Apps Script", cat: "Automation", color: "bg-[#1e3a8a]/20 text-[#bdd0fb] border-[#3b5fc0]/30" },
  { name: "Google Workspace", cat: "Productivity", color: "bg-green-500/10 text-green-300 border-green-500/20" },
  { name: "Airtable", cat: "Database", color: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20" },
  { name: "Slack", cat: "Integration", color: "bg-orange-500/10 text-orange-300 border-orange-500/20" },
  { name: "WhatsApp API", cat: "Integration", color: "bg-green-500/10 text-green-300 border-green-500/20" },
  { name: "Webhooks", cat: "Integration", color: "bg-orange-500/10 text-orange-300 border-orange-500/20" },
  { name: "Zapier", cat: "Automation", color: "bg-[#1e3a8a]/20 text-[#bdd0fb] border-[#3b5fc0]/30" },
  { name: "YouTube API", cat: "API", color: "bg-red-500/10 text-red-300 border-red-500/20" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-gradient-to-br from-[#07091f] via-[#0d1a6e]/20 to-slate-950">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#1e3a8a]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-600/8 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge badge-blue mb-6">About Israel</span>
              <h1 className="text-5xl sm:text-6xl font-black text-white mb-6">
                Helping Businesses{" "}
                <span className="gradient-text">Operate Intelligently</span>
              </h1>
              <p className="text-[#c0cee8] text-lg leading-relaxed mb-8">
                Israel Afolabi is an AI Automation Specialist and the Founder of EasyTech Academy. He designs intelligent systems that eliminate manual work, trains teams to harness AI effectively, and helps businesses scale with automation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="https://calendar.app.google/6EJ6aPfh3ScRUw6V9" target="_blank" rel="noopener noreferrer" className="btn-primary">
                  <Calendar className="w-4 h-4" /> Book Free Call <ArrowRight className="w-4 h-4" />
                </a>
                <a href="https://wa.me/2348139464398?text=Hi%20Israel%2C%20I%20will%20love%20to%20have%20conversations%20with%20you" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  <MessageCircle className="w-4 h-4" /> WhatsApp Israel
                </a>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-3xl blur-2xl scale-105" />
                <div className="relative w-72 h-80 sm:w-80 sm:h-96 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                  <Image src="/images/israel-hero.jpg" alt="Israel Afolabi" fill className="object-cover object-top" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07091f]/50 via-transparent to-transparent" />
                </div>
                <div className="absolute -bottom-4 -right-4 glass-card px-4 py-3 shadow-xl">
                  <p className="text-white font-black text-xl">1500+</p>
                  <p className="text-[#c0cee8] text-xs">People Trained</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-white/[0.02]">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-4xl font-black text-white mb-6">The Story</h2>
              <div className="space-y-4 text-[#c0cee8] leading-relaxed">
                <p>
                  Israel Afolabi didn&apos;t start in AI — he started with a frustration. Watching businesses repeat the same manual tasks day after day, he became obsessed with the question:{" "}
                  <em className="text-white">&ldquo;What if this could just run itself?&rdquo;</em>
                </p>
                <p>
                  That obsession turned into a career. Over the past three years, Israel has designed and deployed automation systems for businesses across Nigeria and beyond — chatbots that qualify leads at midnight, workflows that process data without a single human click, AI pipelines that turn raw information into decisions.
                </p>
                <p>
                  Alongside his consulting work, Israel founded <strong className="text-white">EasyTech Academy</strong> to share what he had learned. To date, he has trained over 1500 individuals and worked with more than 10 organisations — from startups to established brands — helping them transition from manual processes to intelligent, scalable systems.
                </p>
                <p>
                  His mission is bigger than any single project: to train one million people in AI and automation, ensuring that no professional is left behind as the world shifts toward intelligent systems.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-4xl font-black text-white mb-6">Credentials</h2>
              <ul className="space-y-3">
                {credentials.map((c) => (
                  <li key={c} className="flex items-start gap-3 glass-card p-4">
                    <CheckCircle2 className="w-5 h-5 text-[#93b4f5] flex-shrink-0 mt-0.5" />
                    <span className="text-slate-200 font-medium">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <span className="badge badge-blue mb-4">Tech Stack</span>
            <h2 className="text-4xl font-black text-white mb-4">Tools I Use to Build Your Systems</h2>
            <p className="text-[#8899cc] max-w-xl mx-auto">The exact tools that power every automation, AI agent, and workflow Israel builds.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {tools.map((t) => (
              <div key={t.name} className={`px-4 py-2.5 rounded-xl border font-semibold text-sm ${t.color}`}>
                {t.name}
                <span className="ml-2 text-xs opacity-60">{t.cat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding bg-white/[0.02]">
        <div className="container-wide max-w-4xl">
          <div className="text-center">
            <span className="badge badge-blue mb-6">Mission</span>
            <div className="relative glass-card p-10 rounded-3xl">
              <Quote className="w-12 h-12 text-blue-500/20 absolute top-6 left-6" />
              <p className="text-2xl sm:text-3xl font-black text-white leading-snug mb-6 pl-4 border-l-4 border-blue-500 text-left">
                I design intelligent systems that replace manual work with automation, helping businesses scale faster, reduce costs, and operate efficiently — while training a generation of professionals to thrive in an AI-first world.
              </p>
              <p className="text-[#8899cc] text-lg">Goal: Train 1 million people in AI and automation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-cyan-900/20" />
        <div className="container-wide relative z-10 text-center">
          <h2 className="text-4xl font-black text-white mb-4">Work With Israel</h2>
          <p className="text-[#c0cee8] text-lg mb-8 max-w-xl mx-auto">Ready to automate your business or level up your AI skills? Let&apos;s talk.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://calendar.app.google/6EJ6aPfh3ScRUw6V9" target="_blank" rel="noopener noreferrer" className="btn-primary py-3.5 px-8">
              <Calendar className="w-5 h-5" /> Book Free Call <ArrowRight className="w-4 h-4" />
            </a>
            <a href="https://wa.me/2348139464398?text=Hi%20Israel%2C%20I%20will%20love%20to%20have%20conversations%20with%20you" target="_blank" rel="noopener noreferrer" className="btn-whatsapp py-3.5 px-8">
              <MessageCircle className="w-5 h-5" /> WhatsApp Israel
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
