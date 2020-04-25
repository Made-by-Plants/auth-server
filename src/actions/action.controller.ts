import { Post, JsonController, Body, Req, Res } from "routing-controllers";
import { Response, Request } from "express";

@JsonController()
export class ActionController {
  @Post("/actions")
  public actions(
    @Body() actionBody: any,
    @Req() req: Request,
    @Res() res: Response
  ) {
    req.log.info(actionBody);
    res.status(401);
    return {
      message: "Actions code not implemented",
      code: "500",
    };
  }
}
