import express from "express";
import authRouter from "./routers/auth.js"
import ticketRouter from "./routers/tickets.js";
import commentRouter from "./routers/comments.js";

const app = express();

app.use(express.json());

app.use("/auth", authRouter);
app.use("/tickets", ticketRouter);
app.use("/comments", commentRouter);
app.use((err, req, res, next) => {
  console.error(err);
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(status).json({ error: err.message });
});

export default app;
