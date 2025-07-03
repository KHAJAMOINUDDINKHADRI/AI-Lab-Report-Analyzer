# Lab Report Analyzer

A modern web application to extract, organize, and understand your medical lab reports using AI.

## 🌐 Live Demo

Try it now: [Live Demo](https://ai-lab-report-analyzer.vercel.app)

## Features

- Drag-and-drop or click-to-upload your lab report (PDF or image)
- Automatic extraction of patient info and test results using AI (OCR + LLM)
- Clean, structured tables for easy readability
- AI-powered health recommendations (DeepSeek model)
- Modern, responsive and user-friendly design

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, TypeScript)
- **UI:** React 19, Tailwind CSS, shadcn/ui, Geist font
- **OCR:** [Tesseract.js](https://tesseract.projectnaptha.com/)
- **PDF Parsing:** [pdfjs-dist](https://github.com/mozilla/pdf.js)
- **AI/LLM:** DeepSeek via OpenRouter API
- **Markdown Rendering:** react-markdown
- **Icons:** lucide-react, react-icons
- **Table:** @tanstack/react-table

## Setup

Follow these steps to get the project running locally:

1. **Clone the repository**
   ```bash
   git clone https://github.com/KHAJAMOINUDDINKHADRI/AI-Lab-Report-Analyzer.git
   cd AI-Lab-Report-Analyzer
   ```
2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Configure environment variables**

   - Create a `.env.local` file in the root directory with the following content:

     ```env
     # Required for AI functionality - Get from https://openrouter.ai/ for FREE
     OPENROUTER_API_KEY=your_openrouter_api_key_here

     # Optional: Customize AI model (default is free tier)
     AI_MODEL=deepseek/deepseek-chat-v3-0324:free

     # Optional: Site URL for OpenRouter
     NEXT_PUBLIC_SITE_URL=http://localhost:3000
     ```

4. **Get your OpenRouter API Key**
   - Visit [OpenRouter.ai](https://openrouter.ai/)
   - Create an account and generate your API key
   - Add credits for DeepSeek model usage (free tier available)
5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
6. **Open the app**
   - Visit [http://localhost:3000](http://localhost:3000) in your browser.

## How it Works

- **Upload:** Go to the Upload page and select a PDF or image of your lab report.
- **Extraction:** The app uses OCR (Tesseract.js) and an LLM to extract patient info and test results.
- **Results:** View your data in clean tables. Click "Get AI Recommendation" for a personalized summary.
- **Privacy:** No data is stored server-side.

## License

MIT
