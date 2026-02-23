import jwt from "jsonwebtoken";

function generateAccessToken(user) {
    return jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '15m',
    });
}

function generateTokens(user) {
    const accessToken = generateAccessToken(user);
    return { accessToken };
}

export default generateTokens;
