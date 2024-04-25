import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { createTodo, deleteTodo, getTodo, updateComplete, updateContent } from "../controllers/todo.controller.js";
// import { listProduct } from "../controllers/product.controllers.js";

const router = Router();

router.route("/getTodo").post(verifyJWT, getTodo)

router.route("/createTodo").post(verifyJWT, createTodo)

router.route("/updateComplete/:id").post(verifyJWT, updateComplete)

router.route("/updateContent/:id").post(verifyJWT, updateContent)

router.route("/deleteTodo/:id").post(verifyJWT, deleteTodo)

export default router;