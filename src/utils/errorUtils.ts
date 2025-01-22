import { ErrorResponse } from "../models/AppModel";

export class ErrorUtil {
  static isErrorResponse(error: unknown): error is ErrorResponse {
    if (typeof error !== "object" || error === null) {
      console.error("Error is not an object:", error);
      return false;
    }

    if (!("code" in error)) {
      console.error("Error object is missing 'code' property:", error);
      return false;
    }

    return true;
  }

  static logError(error: ErrorResponse): void {
    console.error(`Error ${error.code}: ${error.message}`);
    if (error.details) {
      console.error(`Details: ${error.details}`);
    }
  }

  static formatErrorMessage(error: ErrorResponse): string {
    return `${error.message} (Code: ${error.code})`;
  }
}
