import React, { useState, useEffect } from "react";
import axios from "axios";

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    const response = await axios.get("http://localhost:5000/notices");
    setNotices(response.data);
  };

  const addNotice = async () => {
    if (role !== "admin") {
      alert("❌ Only admins can add notices!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/notices", { title, content }, {
        headers: { Authorization: localStorage.getItem("token") }
      });

      fetchNotices();
      setTitle("");
      setContent("");
    } catch (error) {
      alert("⚠️ Error adding notice!");
    }
  };

  return (
    <div>
      <h1>📢 Digital Notice Board</h1>

      {role === "admin" && (
        <div>
          <h2>Add Notice</h2>
          <input
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button onClick={addNotice}>Add Notice</button>
        </div>
      )}

      <h2>All Notices</h2>
      <ul>
        {notices.map((notice, index) => (
          <li key={index}>
            <strong>{notice.title}</strong>: {notice.content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NoticeBoard;
