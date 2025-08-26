class ApiResponse1 {
    constructor(statusCode, data, message = "Success") {
      this.statusCode = statusCode;
      this.data = data;
      this.message = message;
      this.success = statusCode < 400;
    }
  }
  
  export { ApiResponse1 };

    export const ApiResponse = (res, statusCode, message, data = null) => {
        res.status(statusCode).json({
            statusCode,
            success: statusCode >= 200 && statusCode < 300,
            message,
            data,
        });
    };
    