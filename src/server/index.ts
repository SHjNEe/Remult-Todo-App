import express from "express";
import { remultExpress } from "remult/remult-express";
import { Task } from "../shared/Task";
import { TasksController } from "../shared/TasksController";
import session from "cookie-session";
import { auth } from "./auth";
import { api } from "./api";
const app = express();

app.use(
  session({
    secret: process.env["SESSION_SECRET"] || "my secret",
  })
);
app.use(api);
app.use(auth);

app.listen(3002, () => console.log("Server started"));
