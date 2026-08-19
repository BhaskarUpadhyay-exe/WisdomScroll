import Layout from "../components/Layout";
import AIChat from "../components/ai/AIChat";

function Chat() {
  return (
    <Layout showNavbar={false}>
      <AIChat />
    </Layout>
  );
}

export default Chat;