export async function checkAuth() {
  try {
    const response = await fetch('http://localhost:8080/api/user', {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Auth check failed:', error);
    return false;
  }
}

export function redirectToLogin() {
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}
