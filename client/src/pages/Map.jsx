import { useEffect, useState } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

function Map() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/reports")
      .then((res) => setReports(res.data))
      .catch((err) => console.error(err));
  }, []);

  const defaultPosition = [19.9975, 73.7898];

  return (
    <div style={{ padding: "30px" }}>
      <h1>🗺️ RiverEye Pollution Map</h1>

      <MapContainer
        center={defaultPosition}
        zoom={9}
        style={{ height: "600px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {reports.map((report) => {
  if (!report.latitude || !report.longitude) {
    return null;
  }

  const position = [
    Number(report.latitude),
    Number(report.longitude),
  ];

  return (
    <Marker key={report.id} position={position}>
      <Popup>
        <strong>{report.river}</strong>
        <br />
        📍 {report.location}
        <br />
        Status: {report.status}
      </Popup>
    </Marker>
  );
})}
      </MapContainer>
    </div>
  );
}

export default Map;