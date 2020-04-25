import { Post, JsonController, Body } from "routing-controllers";

@JsonController()
export class ActionController {
  @Post("/actions")
  public actions(@Body() actionBody: any) {
    return {
      message: "Actions code not implemented",
      code: "500",
      actionBody,
    };
  }
}
