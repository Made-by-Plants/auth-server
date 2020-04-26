import { HttpError } from "routing-controllers";

export class UnauthorizedError extends HttpError {
  constructor(public message = "invalid credentials") {
    super(401);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
