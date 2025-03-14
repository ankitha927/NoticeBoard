const API_URL = "http://localhost:5000";

export const fetchNotices = async () => {
  const response = await fetch(`${API_URL}/notices`);
  return response.json();
};

export const addNotice = async (title, content) => {
  await fetch(`${API_URL}/notices`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });
};

export const deleteNotice = async (id) => {
  await fetch(`${API_URL}/notices/${id}`, {
    method: "DELETE",
  });
};
