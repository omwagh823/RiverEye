import { useState } from "react";
import axios from "axios";

function Report() {
  const [name, setName] = useState("");
  const [river, setRiver] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // Image selection
  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImageFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  // Get user's location
  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Location is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);

        alert("📍 Location captured successfully!");
      },
      (error) => {
        console.error(error);
        alert("Unable to get your location.");
      }
    );
  };

  // Submit report
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("river", river);
      formData.append("location", location);
      formData.append("description", description);
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await axios.post(
        "http://localhost:5000/api/reports",
        formData
      );

      console.log(response.data);

      alert("✅ Report Submitted Successfully!");

      // Clear form
      setName("");
      setRiver("");
      setLocation("");
      setDescription("");
      setImage(null);
      setImageFile(null);
      setLatitude("");
      setLongitude("");
    } catch (error) {
      console.error(
        "Upload error:",
        error.response?.data || error
      );

      alert("❌ Submission Failed");
    }
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        background: "white",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0,0,0,.2)",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "25px" }}>
        🌊 Report River Pollution
      </h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={input}
          required
        />

        <input
          type="text"
          placeholder="River Name"
          value={river}
          onChange={(e) => setRiver(e.target.value)}
          style={input}
          required
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={input}
          required
        />

        <textarea
          rows="5"
          placeholder="Describe the Pollution..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={input}
          required
        />

        {/* Location */}
        <button
          type="button"
          onClick={getLocation}
          style={locationButton}
        >
          📍 Capture My Location
        </button>

        {latitude && longitude && (
          <div
            style={{
              background: "#ecfdf5",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "15px",
              color: "#166534",
            }}
          >
            📍 Location captured
            <br />
            Latitude: {latitude.toFixed(6)}
            <br />
            Longitude: {longitude.toFixed(6)}
          </div>
        )}

        {/* Image */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          style={input}
        />

        {image && (
          <img
            src={image}
            alt="Pollution preview"
            style={{
              width: "100%",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          />
        )}

        {/* Submit */}
        <button type="submit" style={button}>
          📤 Submit Report
        </button>
      </form>
    </div>
  );
}

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  boxSizing: "border-box",
  border: "1px solid #ddd",
  borderRadius: "8px",
};

const locationButton = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  background: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
};

const button = {
  width: "100%",
  padding: "14px",
  background: "#0d6efd",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "18px",
  cursor: "pointer",
};

export default Report;