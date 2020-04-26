import { Post, JsonController, Body, Req } from "routing-controllers";
import { ActionHandlers } from "./actions.map";
import { ActionError } from "./action.errors";

@JsonController()
export class ActionController {
  @Post("/actions")
  public async actions(@Body() actionBody: any, @Req() req: any) {
    req.log.debug(actionBody);
    const ActionHandler = ActionHandlers.get(actionBody?.action);
    if (ActionHandler && actionBody?.input) {
      try {
        return await new ActionHandler(actionBody.input).handle();
      } catch (err) {
        throw new ActionError(err.message);
      }
    } else {
      throw new ActionError("Actions code not implemented");
    }
  }
}
