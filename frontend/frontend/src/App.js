import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

function App() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notices, setNotices] = useState([]);

  // Fetch notices on page load
  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await axios.get("http://localhost:5000/notices");
      setNotices(response.data);
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
  };

  const handleAddNotice = async () => {
    if (!title || !content) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/notices", { title, content });
      fetchNotices(); // Refresh the notices list
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Error adding notice:", error);
    }
  };

  // ✅ Function to delete a notice
  const handleDeleteNotice = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/notices/${id}`);
      setNotices(notices.filter(notice => notice.id !== id)); // Update UI
    } catch (error) {
      console.error("Error deleting notice:", error);
    }
  };

  return (
    <div className="container">
      <h1>Digital Notice Board</h1>
      <input
        type="text"
        placeholder="Enter title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Enter content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={handleAddNotice}>Add Notice</button>

      <h2>All Notices:</h2>
      <div className="notice-list">
        {notices.map((notice) => (
          <div key={notice.id} className="notice-item">
            <strong>{notice.title}</strong>: {notice.content}
            <button className="delete-btn" onClick={() => handleDeleteNotice(notice.id)}>🗑 Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
