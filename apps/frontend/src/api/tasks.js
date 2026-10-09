const API_URL = import.meta.env.VITE_API_URL;

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });

  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.status === 204 ? null : response.json();
}

export const getTasks = () => request('/tasks');

export const createTask = (title) =>
  request('/tasks', {
    method: 'POST',
    body: JSON.stringify({ title, status: 'created' }),
  });

export const completeTask = (id) =>
  request(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status: 'done' }),
  });
