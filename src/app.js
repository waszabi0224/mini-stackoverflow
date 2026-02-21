import express from "express";
import authRouter from "./routers/auth.js"

const app = express();

app.use(express.json());
app.use("/auth", authRouter);

app.get("/health", function(req, res) {
    res.json({ok: true});
});

export default app;
