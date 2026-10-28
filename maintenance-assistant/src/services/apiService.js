const API_BASE_URL = 'http://localhost:5000/api';

export const getDashboardData = async () => {
  const response = await fetch(`${API_BASE_URL}/dashboard`);

  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard data: ${response.status}`);
  }

  return response.json();
};
