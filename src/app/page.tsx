export default function Home() {
  return (
    <section>
      <div className="flex flex-col md:flex-row items-center justify-center min-h-[80vh] text-center md:text-left px-4 max-w-6xl mx-auto gap-8">
        {/* Left: Text */}
        <div className="flex-1 flex flex-col items-center md:items-start justify-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-black dark:text-white">
            Lab Report <span className="text-blue-600">Analyzer</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-600 dark:text-zinc-300 max-w-2xl mb-8">
            Upload a lab report (PDF or image) and let{" "}
            <span className="text-blue-600 font-bold">
              {" "}
              Artificial Antelligence
            </span>{" "}
            instantly extract your health parameters and provide{" "}
            <span className="font-bold text-black">Smart Recommendations.</span>
          </p>
          <a href="/upload">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-semibold text-lg transition">
              Upload Report
            </button>
          </a>
        </div>
        {/* Right: Hero Image */}
        <div className="flex-1 flex justify-center md:justify-end">
          <img
            src="/hero-image.jpg"
            alt="Lab Report Analyzer Hero"
            className="w-64 h-64 md:w-96 md:h-96 rounded-lg shadow-lg object-fit"
          />
        </div>
      </div>
    </section>
  );
}
