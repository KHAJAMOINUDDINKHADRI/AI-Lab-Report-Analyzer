"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

export default function ResultPage() {
  const [userInfo, setUserInfo] = useState<{ label: string; value: string }[]>(
    []
  );
  const [testData, setTestData] = useState<
    { parameter: string; value: string; unit: string; range: string }[]
  >([]);
  const [recommendation, setRecommendation] = useState<string>("");
  const [recLoading, setRecLoading] = useState(false);
  const [recError, setRecError] = useState<string | null>(null);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userInfoStr = sessionStorage.getItem("userInfo");
      const testDataStr = sessionStorage.getItem("testData");
      if (userInfoStr) setUserInfo(JSON.parse(userInfoStr));
      if (testDataStr) setTestData(JSON.parse(testDataStr));
    }
  }, []);

  async function handleGetRecommendation() {
    setShowRecommendation(true);
    setRecLoading(true);
    setRecError(null);
    try {
      const res = await fetch("/api/lab-recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInfo, testData }),
      });
      const data = await res.json();
      if (!res.ok || !data.recommendation) {
        setRecError(data.error || "Failed to get recommendation.");
      } else {
        setRecommendation(data.recommendation);
      }
    } catch {
      setRecError("Failed to get recommendation.");
    } finally {
      setRecLoading(false);
    }
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] px-4 bg-gradient-to-br from-blue-50 via-white to-zinc-100">
      <h1 className="text-4xl md:text-5xl mt-8 font-extrabold mb-8 text-blue-700 text-center drop-shadow-sm tracking-tight">
        Lab Report Results
      </h1>
      <div
        className="flex justify-start w-full mb-4"
        style={{ marginLeft: "36vw" }}
      >
        <button
          className="bg-zinc-900 text-white px-4 py-2 rounded-md font-semibold shadow transition"
          onClick={() => router.push("/upload")}
        >
          &larr; Back to Upload
        </button>
      </div>
      <div className="mt-6 w-full max-w-4xl flex flex-col items-center">
        {userInfo.length > 0 && (
          <div className="w-full flex flex-col items-center mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800 text-center tracking-tight">
              Patient Information
            </h2>
            <table className="w-full rounded-lg mx-auto bg-white text-zinc-900 shadow">
              <tbody>
                {userInfo.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-t border-zinc-100 hover:bg-blue-50 transition-colors"
                  >
                    <td className="px-4 py-2 font-medium w-1/3 text-zinc-700">
                      {row.label}
                    </td>
                    <td className="px-4 py-2 w-2/3">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {testData.length > 0 && (
          <div className="w-full flex flex-col items-center mb-10 mt-12">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800 text-center tracking-tight">
              Test Results
            </h2>
            <table className="w-full rounded-lg mx-auto bg-white text-zinc-900 shadow mb-8">
              <thead>
                <tr className="bg-blue-100">
                  <th className="px-4 py-2 text-left">Parameter</th>
                  <th className="px-4 py-2 text-left">Value</th>
                  <th className="px-4 py-2 text-left">Unit</th>
                  <th className="px-4 py-2 text-left">Reference Range</th>
                </tr>
              </thead>
              <tbody>
                {testData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-t border-zinc-100 hover:bg-blue-50 transition-colors"
                  >
                    <td className="px-4 py-2">{row.parameter}</td>
                    <td className="px-4 py-2">{row.value}</td>
                    <td className="px-4 py-2">{row.unit}</td>
                    <td className="px-4 py-2">{row.range}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {userInfo.length === 0 && testData.length === 0 && (
          <p className="text-zinc-500 text-center mt-8">
            No results found. Please upload a lab report first.
          </p>
        )}
        {(userInfo.length > 0 || testData.length > 0) &&
          !showRecommendation && (
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow transition mb-8"
              onClick={handleGetRecommendation}
              disabled={recLoading}
            >
              {recLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
                  Generating Recommendation...
                </span>
              ) : (
                "Get AI Recommendation"
              )}
            </button>
          )}
        {showRecommendation && (
          <div className="w-full border border-blue-500 rounded-2xl bg-white text-zinc-900 p-8 shadow-xl transition-all mb-8 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center tracking-tight">
              AI Recommendation
            </h2>
            {recLoading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600 mb-2"></div>
                <p className="text-blue-700 text-center text-sm">
                  Generating personalized recommendation...
                </p>
              </div>
            ) : recError ? (
              <p className="text-red-500 text-center text-sm">{recError}</p>
            ) : (
              <div className="prose prose-blue max-w-none text-lg leading-relaxed">
                <ReactMarkdown>{recommendation}</ReactMarkdown>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
