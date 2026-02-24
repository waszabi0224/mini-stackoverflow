import jwt from "jsonwebtoken";

function isAuthenticated(req, res, next) {
    const { authorization } = req.headers;

    if(!authorization) {
        res.status(401);
        throw new Error("Nem érvényes token.");
    }

    try {
        const token = authorization.split(' ')[1];
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.payload = payload;
    } catch (err) {
        res.status(401);
        if(err.name === "TokenExpiredError") {
            throw new Error(err.name);
        }
        throw new Error("Nem érvényes token.");
    }
    return next();
}

export default isAuthenticated;
