import models from "../models";
import Router from "./router";

const router = Router.userRouter(models.users.userModel);

export default router;
