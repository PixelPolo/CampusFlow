export class AuthService {
  private _isLoggedIn: boolean = true; // Simulation

  login() {
    this._isLoggedIn = true;
  }

  logout() {
    this._isLoggedIn = false;
  }

  isAuthenticated(): boolean {
    return this._isLoggedIn;
  }

  getUserRoles() {
    return ["student", "professor", "administrative"]; // Simulation
    return ["none"];
    return ["student"];
    return ["professor"];
    return ["administrative"];
  }
}
