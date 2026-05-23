const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getReadings(range: string) {
  const response = await fetch(
    `${API_BASE_URL}/readings?range=${range}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch readings');
  }

  return response.json();
}