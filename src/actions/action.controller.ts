import { Post, JsonController, Body, Req } from "routing-controllers";

@JsonController()
export class ActionController {
  @Post("/actions")
  public actions(@Body() actionBody: any, @Req() req: any) {
    req.log.info(actionBody);
    return {
      message: "Actions code not implemented",
      code: "500",
    };
  }
}
