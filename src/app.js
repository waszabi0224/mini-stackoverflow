import express from "express";
import authRouter from "./routers/auth.js"
import ticketRouter from "./routers/tickets.js";

const app = express();

app.use(express.json());

app.use("/auth", authRouter);
app.use("/tickets", ticketRouter);

export default app;
