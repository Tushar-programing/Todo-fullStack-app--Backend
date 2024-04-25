import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { changeCurrentPassword, getCurrentUser, login, logoutUser, refreshAccessToken, register, updateName } from "../controllers/user.controllers.js";
// import 
 
const router = Router();

router.route("/register").post(register)

router.route("/login").post(login)

router.route("/logout").post(verifyJWT, logoutUser)

router.route("/refreshAccessToken").post(verifyJWT, refreshAccessToken);

router.route("/changeCurrentPassword").post(verifyJWT, changeCurrentPassword);

router.route("/getCurrentUser").post(verifyJWT, getCurrentUser);

router.route("/updateName").post(verifyJWT, updateName);


export default router;