
import Layout from "../components/Layout";
import AIChat from "../components/ai/AIChat";

function Chat() {
  return (
    <Layout>
      <div
        style={{
          textAlign: "center",
          marginTop: "50px",
          padding: "30px",
        }}
      >
  
<AIChat />
      </div>
    </Layout>
  );
}

export default Chat;