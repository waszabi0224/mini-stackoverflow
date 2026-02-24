import {Router} from "express";
import bcrypt from "bcrypt";
import db from "../db/prisma.js";
import generateTokens from "../utils/jwt.js";
import isAuthenticated from "../utils/middlewares.js";

const router = Router();

router.post('/regisztracio', async(req, res, next) => {
    try {
        const { email, username, password, role, birthDate, gender } = req.body;
        if(!email || ! username || !password || !birthDate) {
            res.status(400);
            throw new Error("Töltsd ki a kötelező mezőket.");
        }

        const existingUser = await findUserByEmail(email);
        const existingUsername = await findUserByUsername(username);

        if(existingUser) {
            res.status(400);
            throw new Error("Ez az email cím már létezik.");
        }

        if(existingUsername) {
            res.status(400);
            throw new Error("Ez a felhasználónév már foglalt.");
        }

        const user = await createUserByEmailAndPassword({ email, username, password, role, birthDate, gender });
        const { accessToken } = generateTokens(user);

        res.json({
            accessToken,
        });
    } catch (err) {
        next(err);
    }
});

router.post('/bejelentkezes', async(req, res, next) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            res.status(400);
            throw new Error("Töltsd ki a kötelező mezőket.");
        }

        const existingUser = await findUserByEmail(email);

        if(!existingUser) {
            res.status(400);
            throw new Error("Hibás felhasználónév vagy jelszó.");
        }

        const validPassword = await bcrypt.compare(password, existingUser.password);
        if(!validPassword) {
            res.status(400);
            throw new Error("Hibás felhasználónév vagy jelszó.");
        }

        const { accessToken } = generateTokens(existingUser);
        
        res.json({
            accessToken,
        });
    } catch (err) {
        next(err);
    }
});

router.get('/profil', isAuthenticated, async(req, res, next) => {
    try {
        const { userId } = req.payload;

        const user = await findUserById(userId);
        if(!user) {
            res.status(400);
            throw new Error("Hibás token.");
        }

        delete user.password;
        res.json(user);
    } catch (err) {
        next(err);
    }
});

function findUserByEmail(email) {
    return db.user.findUnique({
        where: {
            email,
        },
    });
}

function findUserByUsername(username) {
    return db.user.findUnique({
        where: {
            username,
        },
    });
}

function createUserByEmailAndPassword(user) {
    user.password = bcrypt.hashSync(user.password, 12);
    return db.user.create({
        data: {
            email: user.email,
            username: user.username,
            password: user.password,
            role: user.role,
            birthDate: new Date(user.birthDate),
            gender: user.gender,
        },
    });
}

function findUserById(id) {
    return db.user.findUnique({
        where: {
            id,
        },
    });
}


export default router;
