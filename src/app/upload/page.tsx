"use client";
import React, { useState } from "react";
import Tesseract from "tesseract.js";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [userInfo, setUserInfo] = useState<{ label: string; value: string }[]>(
    []
  );
  const [testData, setTestData] = useState<
    { parameter: string; value: string; unit: string; range: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSelectedFile(e.target.files?.[0] || null);
    setUserInfo([]);
    setTestData([]);
    setError(null);
  }

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUserInfo([]);
    setTestData([]);
    setError(null);
    if (!selectedFile) return;
    setLoading(true);
    try {
      let fullText = "";
      if (selectedFile.type === "application/pdf") {
        const pdfjsLib = await import("pdfjs-dist");
        await import("pdfjs-dist/build/pdf.worker.mjs");
        const pdf = await pdfjsLib.getDocument({
          data: await selectedFile.arrayBuffer(),
        }).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: context!, viewport }).promise;
          const {
            data: { text },
          } = await Tesseract.recognize(canvas, "eng");
          fullText += text + "\n";
        }
      } else if (selectedFile.type.startsWith("image/")) {
        const {
          data: { text },
        } = await Tesseract.recognize(selectedFile, "eng");
        fullText = text;
      } else {
        setError("Unsupported file type. Please upload a PDF or image file.");
        setLoading(false);
        return;
      }
      // Send OCR text to API
      console.log(fullText)
      const response = await fetch("/api/parse-lab-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: fullText }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        setError(result.error || "Failed to parse lab report.");
        setLoading(false);
      } else {
        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            "userInfo",
            JSON.stringify(result.userInfo || [])
          );
          sessionStorage.setItem(
            "testData",
            JSON.stringify(result.testData || [])
          );
        }
        setLoading(false);
        router.push("/result");
      }
    } catch {
      setError("Failed to extract or parse text. Please try again.");
      setLoading(false);
    }
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-black text-center">
        Upload Lab Report
      </h1>
      <form
        className="bg-zinc-900 p-8 rounded-lg shadow-lg flex flex-col gap-6 w-full max-w-md border border-zinc-800"
        onSubmit={handleUpload}
      >
        <label
          className="text-zinc-200 text-lg font-medium"
          htmlFor="file-upload"
        >
          Select a file:
        </label>
        <div>
          <input
            id="file-upload"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,image/*"
            className="file:bg-blue-600 file:text-white file:rounded file:px-6 file:py-2 file:border-0 file:font-semibold file:mr-6 file:transition file:hover:bg-blue-700 bg-zinc-800 text-zinc-100 rounded p-2"
            onChange={handleFileChange}
            disabled={loading}
          />
          <p className="text-zinc-400 text-xs mt-2">
            Only PDF, PNG, JPG, or JPEG files are accepted.
          </p>
        </div>
        {loading ? (
          <div className="flex flex-col items-center mt-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-3"></div>
            <p className="text-zinc-400 text-center text-sm">
              Processing your lab report. This may take a few seconds depending
              on file size and network speed...
            </p>
          </div>
        ) : (
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 mt-12 rounded-md font-semibold text-lg transition"
            disabled={loading}
          >
            Upload
          </button>
        )}
      </form>
      <div className="mt-8 w-full max-w-2xl flex flex-col items-center">
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {!loading &&
          !error &&
          userInfo.length === 0 &&
          testData.length === 0 && (
            <p className="text-zinc-500 text-center">
              After uploading, your patient info and test results will appear
              here in clean, structured tables.
            </p>
          )}
      </div>
    </section>
  );
}
