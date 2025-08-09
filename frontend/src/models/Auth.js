export class LoginRequest {
  constructor(usernameOrEmail, password) {
    this.usernameOrEmail = usernameOrEmail;
    this.password = password;
  }

  toApiRequest() {
    return {
      usernameOrEmail: this.usernameOrEmail,
      password: this.password
    };
  }
}

export class RegisterRequest {
  constructor(data) {
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.profileImage = data.profileImage || '';
  }

  toApiRequest() {
    return {
      username: this.username,
      email: this.email,
      password: this.password,
      profileImage: this.profileImage
    };
  }
}

export class TokenResponse {
  constructor(data = {}) {
    this.token = data.accessToken || '';
    this.expiresAt = data.expiresAt || new Date().toISOString();
    this.user = data.user || null;
  }

  static fromApiResponse(data) {
    return new TokenResponse(data);
  }

  isExpired() {
    return new Date() >= new Date(this.expiresAt);
  }
}
