import { HttpError } from "routing-controllers";

export class ActionError extends HttpError {
  constructor(public message) {
    super(422);
    Object.setPrototypeOf(this, ActionError.prototype);
  }

  public toJSON() {
    return {
      code: this.httpCode.toString(),
      message: this.message,
    };
  }
}
