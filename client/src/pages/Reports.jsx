import { useEffect, useState } from "react";
import axios from "axios";

function Reports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const response = await axios.get(
        "http://https://rivereye.onrender.com:5000/api/reports"
      );

      setReports(response.data);
    } catch (error) {
      console.error("Failed to load reports:", error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        padding: "30px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "36px",
          fontWeight: "bold",
          marginBottom: "30px",
        }}
      >
        🌊 RiverEye Reports
      </h1>

      {reports.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          No reports found.
        </p>
      ) : (
        <div
          style={{
            maxWidth: "900px",
            margin: "auto",
          }}
        >
          {reports.map((report) => (
            <div
              key={report.id}
              style={{
                background: "white",
                padding: "20px",
                marginBottom: "20px",
                borderRadius: "12px",
                boxShadow: "0 3px 12px rgba(0,0,0,0.1)",
              }}
            >
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              >
                🌊 {report.river}
              </h2>

              <p>
                👤 <strong>Name:</strong> {report.name}
              </p>

              <p>
                📍 <strong>Location:</strong> {report.location}
              </p>

              <p>
                📝 <strong>Description:</strong>{" "}
                {report.description}
              </p>

              {/* Status */}
              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color:
                      report.status === "Verified"
                        ? "green"
                        : "orange",
                    fontWeight: "bold",
                  }}
                >
                  {report.status}
                </span>
              </p>

              {/* AI Analysis */}
              {report.ai_result && (
                <div
                  style={{
                    marginTop: "15px",
                    padding: "15px",
                    background: "#eff6ff",
                    borderRadius: "10px",
                    border: "1px solid #bfdbfe",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                    }}
                  >
                    🤖 AI Analysis
                  </h3>

                  <p>
                    Detection:{" "}
                    <strong>{report.ai_result}</strong>
                  </p>

                  <p>
                    Confidence:{" "}
                    <strong>
                      {report.ai_confidence}%
                    </strong>
                  </p>
                </div>
              )}

              {/* Uploaded Image */}
              {report.image && (
                <div style={{ marginTop: "15px" }}>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                    }}
                  >
                    📷 Pollution Image
                  </h3>

                  <img
                    src={report.image}
                    alt="River pollution"
                    style={{
                      width: "100%",
                      maxHeight: "450px",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                </div>
              )}

              {/* GPS Coordinates */}
              {report.latitude !== null &&
                report.longitude !== null && (
                  <p
                    style={{
                      marginTop: "12px",
                      color: "#555",
                    }}
                  >
                    🗺️ Coordinates:{" "}
                    {Number(report.latitude).toFixed(6)},{" "}
                    {Number(report.longitude).toFixed(6)}
                  </p>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Reports;