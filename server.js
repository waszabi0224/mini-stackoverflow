const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/health", function(req, res) {
    res.json({ok: true});
});

app.listen(PORT, function(err) {
    if(err) console.log(err);
    console.log("server listening on PORT", PORT);
});