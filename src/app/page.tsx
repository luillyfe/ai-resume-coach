import Feedback from "./Feedback";
import { sendMessage } from "./LLM";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">CV AI Coach</h1>
        <Feedback sendMessage={sendMessage} />
      </main>
      <footer className="py-4 text-center text-sm text-gray-500">
        Made with{" "}
        <span className="text-red-500 hover:text-red-600 transition-colors duration-300">
          ❤
        </span>{" "}
        by{" "}
        <a
          href="https://luillyfe.medium.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-700 transition-colors duration-300"
        >
          Fermin Blanco
        </a>
      </footer>
    </div>
  );
}
