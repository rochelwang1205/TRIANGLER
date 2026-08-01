export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return Boolean(getStoredUser() && localStorage.getItem('token'));
}
