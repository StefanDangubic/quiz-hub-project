export class ApiResponse {
  constructor(data = {}) {
    this.success = data.success || false;
    this.message = data.message || '';
    this.data = data.data || null;
    this.errors = data.errors || [];
  }

  static fromApiResponse(response) {
    return new ApiResponse(response);
  }

  static success(data, message = 'Success') {
    return new ApiResponse({
      success: true,
      message,
      data
    });
  }

  static error(message, errors = []) {
    return new ApiResponse({
      success: false,
      message,
      errors
    });
  }

  hasErrors() {
    return this.errors && this.errors.length > 0;
  }

  getFirstError() {
    return this.hasErrors() ? this.errors[0] : this.message;
  }
}
