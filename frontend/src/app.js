import React, { useEffect, useState } from "react";
import { fetchNotices, addNotice } from "./api";

function App() {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    const data = await fetchNotices();
    setNotices(data);
  };

  const handleAddNotice = async () => {
    if (title && content) {
      await addNotice(title, content);
      setTitle("");
      setContent("");
      loadNotices(); // Refresh the list
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>📢 Digital Notice Board</h2>

      <div>
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
        <button onClick={handleAddNotice}>Add Notice</button>
      </div>

      <h3>All Notices:</h3>
      <ul>
        {notices.map((notice) => (
          <li key={notice.id}>
            <strong>{notice.title}</strong>: {notice.content}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
