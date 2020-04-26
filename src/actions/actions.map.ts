import { ActionLogin } from "./login";

export enum Action {
  Login = "Login",
}

export const ActionHandlers = new Map([[Action.Login, ActionLogin]]);
