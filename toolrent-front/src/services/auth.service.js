import httpClient from "../http-common";

class AuthService {
  login(username, password) {
    return httpClient.post("/auth/login", {
      username,
      password
    });
  }

  register(userData) {
    return httpClient.post("/auth/register", userData);
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return httpClient.post("/auth/logout");
  }

  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  getToken() {
    return localStorage.getItem("token");
  }

  saveUserData(token, user) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  }

  isLoggedIn() {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === "ADMIN";
  }

  isEmployee() {
    const user = this.getCurrentUser();
    return user && (user.role === "EMPLOYEE" || user.role === "ADMIN");
  }

  validateToken() {
    const token = this.getToken();
    if (!token) {
      return Promise.reject("No token found");
    }

    return httpClient.get("/auth/validate", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  clearUserData() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}

export default new AuthService();