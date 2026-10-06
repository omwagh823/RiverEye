import { useState } from "react";
import axios from "axios";

function AITest() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/ai-test",
        formData
      );

      setResult(response.data.result);
    } catch (error) {
      console.error(
        "AI test error:",
        error.response?.data || error
      );

      const message =
  error.response?.data?.message ||
  error.response?.data?.error ||
  error.message ||
  "Unknown AI error";

console.error("FULL AI ERROR:", error);

alert("AI Error: " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "50px auto",
        padding: "30px",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0,0,0,.15)",
      }}
    >
      <h1>🤖 RiverEye AI Test</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            display: "block",
            marginTop: "20px",
            padding: "12px 20px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
          }}
        >
          {loading ? "Analyzing..." : "Analyze Image"}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: "30px" }}>
          <h2>AI Result</h2>

          {result.map((item, index) => (
            <p key={index}>
              <strong>{item.label}</strong>
              {" — "}
              {(item.score * 100).toFixed(2)}%
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default AITest;