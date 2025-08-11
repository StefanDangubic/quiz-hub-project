export class User {
  constructor(data = {}) {
    this.id = data.id || 0;
    this.username = data.username || '';
    this.email = data.email || '';
    this.profileImage = data.profileImage || '';
    this.role = this.mapRole(data.role) || data.role;
    this.isActive = data.isActive || true;
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  mapRole(roleValue){
    if(roleValue === 2) return 'Admin';
    return 'User';
  }

  static fromApiResponse(data) {
    return new User(data);
  }

  isAdmin() {
    return this.role === 'Admin';
  }

  getDisplayName() {
    return this.username || this.email;
  }

  getInitials() {
    return this.username.substring(0, 2).toUpperCase();
  }
}
