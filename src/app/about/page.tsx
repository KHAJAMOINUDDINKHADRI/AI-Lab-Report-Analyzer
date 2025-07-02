"use client";

export default function AboutPage() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] px-4 bg-gradient-to-br from-blue-50 via-white to-zinc-100">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6 mt-12 text-blue-700 text-center drop-shadow-sm tracking-tight">
        About Lab Report Analyzer
      </h1>
      <p className="text-lg text-zinc-700 max-w-2xl text-center mb-8">
        Lab Report Analyzer is a modern web application that helps you extract,
        organize, and understand your medical lab reports. Upload your PDF or
        image, and let our AI-powered system do the rest!
      </p>
      <div className="bg-white border border-zinc-200 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-blue-800 mb-4 text-center">
          Key Features
        </h2>
        <ul className="list-disc list-inside text-zinc-800 text-lg space-y-2">
          <li>
          Drag-and-drop or click-to-upload your lab report (PDF or image)
          </li>
          <li>Automatic extraction of patient info and test results using AI</li>
          <li>Clean, structured tables for easy readability</li>
          <li>AI-powered health recommendations (DeepSeek model)</li>
          <li>Modern, responsive, and privacy-friendly design</li>
        </ul>
      </div>
    </section>
  );
}
