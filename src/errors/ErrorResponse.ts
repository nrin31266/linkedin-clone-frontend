export class ErrorResponse extends Error {
  code: number;
  details?: string;
  constructor(
    code: number,
    message: string,
    details?: string
  ) {
    super(message);
    this.name = "ErrorResponse";
    this.code = code;
    this.details = details;
  }
}
