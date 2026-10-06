import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = "http://localhost:5000";

  const getReports = async () => {
    try {
      const response = await axios.get(
        `${API}/api/reports`
      );

      setReports(response.data);
    } catch (error) {
      console.error(
        "Failed to load reports:",
        error
      );

      alert("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReports();
  }, []);

  // ==========================================
  // VERIFY
  // ==========================================

  const verifyReport = async (id) => {
    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        alert(
          "❌ Login required. Please login again."
        );
        return;
      }

      const response = await axios.put(
        `${API}/api/reports/${id}/verify`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Verify response:",
        response.data
      );

      alert(
        "✅ Report verified successfully!"
      );

      getReports();
    } catch (error) {
      console.error(
        "VERIFY ERROR:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Failed to verify report"
      );
    }
  };

  // ==========================================
  // REJECT
  // ==========================================

  const rejectReport = async (id) => {
    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        alert(
          "❌ Login required. Please login again."
        );
        return;
      }

      const response = await axios.put(
        `${API}/api/reports/${id}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Reject response:",
        response.data
      );

      alert(
        "❌ Report rejected successfully!"
      );

      getReports();
    } catch (error) {
      console.error(
        "REJECT ERROR:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Failed to reject report"
      );
    }
  };

  // ==========================================
  // STATISTICS
  // ==========================================

  const pending = reports.filter(
    (report) =>
      report.status === "Pending"
  ).length;

  const verified = reports.filter(
    (report) =>
      report.status === "Verified"
  ).length;

  const rejected = reports.filter(
    (report) =>
      report.status === "Rejected"
  ).length;

  const rivers = new Set(
    reports.map(
      (report) => report.river
    )
  ).size;

  // ==========================================
  // UI
  // ==========================================

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
          fontSize: "32px",
          fontWeight: "bold",
        }}
      >
        🌊 RiverEye Admin Dashboard
      </h1>

      <p
        style={{
          color: "#666",
          marginBottom: "30px",
        }}
      >
        Monitor and manage river
        pollution reports.
      </p>

      {/* STATISTICS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <StatCard
          title="Total Reports"
          value={reports.length}
          icon="📄"
        />

        <StatCard
          title="Pending"
          value={pending}
          icon="⏳"
        />

        <StatCard
          title="Verified"
          value={verified}
          icon="✅"
        />

        <StatCard
          title="Rejected"
          value={rejected}
          icon="❌"
        />

        <StatCard
          title="Rivers Covered"
          value={rivers}
          icon="🌊"
        />
      </div>

      {/* REPORTS */}

      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "25px",
          boxShadow:
            "0 3px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            marginBottom: "20px",
          }}
        >
          📋 Pollution Reports
        </h2>

        {loading ? (
          <p>Loading reports...</p>
        ) : reports.length === 0 ? (
          <p>No reports available.</p>
        ) : (
          reports.map((report) => (
            <div
              key={report.id}
              style={{
                borderBottom:
                  "1px solid #ddd",
                padding: "20px 0",
              }}
            >
              <h3
                style={{
                  fontSize: "20px",
                  marginBottom: "10px",
                }}
              >
                🌊 {report.river}
              </h3>

              <p>
                👤{" "}
                <strong>Name:</strong>{" "}
                {report.name}
              </p>

              <p>
                📍{" "}
                <strong>Location:</strong>{" "}
                {report.location}
              </p>

              <p>
                📝{" "}
                <strong>Description:</strong>{" "}
                {report.description}
              </p>

              {/* STATUS */}

              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color:
                      report.status ===
                      "Verified"
                        ? "green"
                        : report.status ===
                          "Rejected"
                        ? "red"
                        : "orange",
                    fontWeight: "bold",
                  }}
                >
                  {report.status}
                </span>
              </p>

              {/* IMAGE */}

              {report.image && (
                <img
                  src={report.image}
                  alt="River pollution"
                  style={{
                    width: "300px",
                    maxWidth: "100%",
                    maxHeight: "220px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginTop: "10px",
                  }}
                />
              )}

              {/* GPS */}

              {report.latitude &&
                report.longitude && (
                  <p
                    style={{
                      color: "#555",
                      marginTop: "10px",
                    }}
                  >
                    🗺️ Coordinates:{" "}
                    {Number(
                      report.latitude
                    ).toFixed(6)}
                    ,{" "}
                    {Number(
                      report.longitude
                    ).toFixed(6)}
                  </p>
                )}

              {/* AI */}

              {report.ai_result && (
                <div
                  style={{
                    marginTop: "15px",
                    padding: "15px",
                    background:
                      "#eff6ff",
                    borderRadius: "8px",
                  }}
                >
                  🤖{" "}
                  <strong>
                    AI Detection:
                  </strong>{" "}
                  {report.ai_result}

                  <br />

                  🎯{" "}
                  <strong>
                    Confidence:
                  </strong>{" "}
                  {report.ai_confidence}%
                </div>
              )}

              {/* BUTTONS */}

              {report.status ===
                "Pending" && (
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "15px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onClick={() =>
                      verifyReport(
                        report.id
                      )
                    }
                    style={{
                      padding:
                        "10px 18px",
                      background:
                        "#16a34a",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor:
                        "pointer",
                    }}
                  >
                    ✅ Verify
                  </button>

                  <button
                    onClick={() =>
                      rejectReport(
                        report.id
                      )
                    }
                    style={{
                      padding:
                        "10px 18px",
                      background:
                        "#dc2626",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor:
                        "pointer",
                    }}
                  >
                    ❌ Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ==========================================
// STAT CARD
// ==========================================

function StatCard({
  title,
  value,
  icon,
}) {
  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow:
          "0 3px 10px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          fontSize: "30px",
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          color: "#666",
          marginTop: "10px",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: "30px",
          fontWeight: "bold",
          margin: "5px 0 0",
        }}
      >
        {value}
      </p>
    </div>
  );
}

export default Dashboard;