import Layout from "../components/Layout";

function About() {
  return (
    <Layout>
      <div
        style={{
          textAlign: "center",
          marginTop: "50px",
          padding: "30px",
          backgroundColor: "#111827",
          color: "white",
          borderRadius: "20px",
          marginBottom: "30px",
        }}
      >
        <h2>WISDOMSCROLL AI</h2>

        <p>
          <strong>Builder:</strong>
          <br />
          Bhaskar Upadhyay
        </p>

        <p>
          <strong>Project:</strong>
          <br />
          WisdomScroll AI
        </p>

        <p>
          <strong>Version:</strong>
          <br />
          v1.0
        </p>

        <p>
          <strong>Status:</strong>
          <br />
          <span
            style={{
              color: "#22C55E",
              fontWeight: "bold",
              fontSize: "20px",
            }}
          >
            ● ONLINE
          </span>
        </p>

        <p>
          <strong>Powered By:</strong>
          <br />
          Llama 3.3 70B + Groq
        </p>

        <div
          style={{
            marginTop: "50px",
            padding: "30px",
            borderRadius: "20px",
            backgroundColor: "#1F2937",
          }}
        >
          <p>You have used WisdomScroll.</p>

          <p>But you've never met the person who built it.</p>

          <p>Click below.</p>

          <p>I dare you.</p>

          <a
            href="https://www.instagram.com/upadhyay_exe"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              marginTop: "20px",
              padding: "15px 30px",
              backgroundColor: "#E1306C",
              color: "white",
              textDecoration: "none",
              borderRadius: "12px",
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            👀 WHO AM I?
          </a>
        </div>
      </div>
    </Layout>
  );
}

export default About;