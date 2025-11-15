class ServiceError extends Error {
  constructor(msg = "Unknown error", statusCode = 500) {
    super(msg);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

export default ServiceError;
