import models from "../models";
import { userRouter } from "./js/base";

const router = userRouter(models.users.usersModel);

export default router;
