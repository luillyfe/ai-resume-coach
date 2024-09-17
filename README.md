# 🚀 CV AI Coach: Your Personal Resume Guru

## 🎭 The Elevator Pitch

Imagine having a seasoned tech recruiter, a sharp-eyed editor, and a Silicon Valley insider all rolled into one, ready to scrutinize your CV 24/7. That's CV AI Coach for you! We're not just another resume checker – we're your secret weapon in the cut-throat tech job market.

## 🧠 What's Under the Hood?

At the heart of CV AI Coach lies a powerful AI brain, leveraging Google's Gemini 1.5 Pro model. Here's the secret sauce:

1. **PDF Whisperer**: We speak fluent PDF. Upload your resume, and we'll extract every juicy detail.
2. **AI Magnifying Glass**: Our Gemini-powered algorithm dissects your CV with the precision of a surgeon and the creativity of a poet.
3. **Markdown Magician**: Feedback so beautifully formatted, you'll want to frame it. (But please don't – update your CV instead!)
4. **PDF Alchemist**: Transform your feedback into a sleek, professional PDF report with a click.

## 🛠 Tech Stack Lowdown

- **Next.js**: Because we believe in living on the edge... of web technology.
- **React**: For UI smoothness that'll make you go "Oooh!"
- **Ant Design**: Our secret to looking good without trying too hard.
- **Recharts**: For visualizing your CV insights with style.
- **Google Gemini API**: Powering our analysis with cutting-edge language models.
- **react-pdf**: Turning our markdown feedback into stunning PDF reports.

## 🚦 Getting Started

1. **Clone the repo**: `git clone https://github.com/your-username/cv-ai-coach.git`
2. **Install dependencies**: `npm install` (or `yarn install` if you're fancy)
3. **Set up your environment**:
   ```
   GEMINI_API_KEY=your_secret_key_here
   ```
   (You'll need a Gemini API key from Google. Don't have one? Time to make friends at Mountain View!)
4. **Fire it up**: `npm run dev`
5. **Upload your CV**: And watch the magic happen!

## 🎨 Customization: Make It Yours

Want to tweak the AI prompts? Fancy a different UI? Go wild! The code is your oyster. Just remember:

- AI interactions are handled in `LLM.ts` and `LLMClient.tsx`. Adjust the prompts or integrate different AI services here.
- UI components like `CVAnalyzer`, `CVFeedback`, and `CVInsights` are in the `components` folder. Feel free to jazz them up!
- The `PDFGenerator` component in `PDFGenerator.tsx` controls the PDF output. Tweak it to change the look of your reports.

## 🤓 For the Nerds

- We're using Next.js App Router for efficient server-side rendering and API routes.
- React hooks (`useCVStorage`) manage state and side effects.
- TypeScript is used throughout for type safety and better developer experience.
- Recharts library is employed for creating insightful visualizations of CV data.
- Google's Gemini 1.5 Pro model powers our AI analysis, with custom prompts for CV feedback and data extraction.
- The `react-pdf` library transforms our markdown feedback into polished PDF reports.

## 🚧 Roadmap

- [ ] Enhance CV data extraction and analysis
- [ ] Implement user accounts for tracking CV versions
- [ ] Integrate with job boards for tailored recommendations
- [ ] Expand visualizations and insights in the CVInsights component
- [ ] Add more customization options for PDF reports

## 🤝 Contributing

Found a bug? Have a cool idea? We're all ears! Open an issue or slide into our DMs with a pull request. Just remember, with great power comes great responsibility – use your coding superpowers wisely!

## 📜 License

MIT License. Because sharing is caring, and we care a lot!

---

Remember, a great CV opens doors. A CV that's been through CV AI Coach kicks those doors down. Happy job hunting, and may the odds be ever in your favor! 🎉
