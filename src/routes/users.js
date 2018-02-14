import models from "../models";
import { userRouter } from "./js/base";

const router = userRouter(models.users.userModel);

export default router;
