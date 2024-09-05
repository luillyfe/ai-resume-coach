import Feedback from "./Feedback";
import { sendMessage } from "./LLM";

export default function Home() {
  return (
    <>
      <Feedback sendMessage={sendMessage} />
    </>
  );
}
