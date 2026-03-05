import app from "../src/app.js";
import request from "supertest";
import { describe, it, expect, afterAll } from "vitest";
import { Role, Gender } from "@prisma/client";
import db from "../src/db/prisma.js";

const email = "unittestAUTH@gmail.com";

describe("POST /auth/regisztracio", () => {
    it("regisztrál egy felhasználót", async() => {
        const res = await request(app).post("/auth/regisztracio").send({
            email: email,
            username: "unittestAUTH",
            password: "unit",
            role: Role.USER,
            birthDate: "2003-02-24",
            gender: Gender.FEMALE,
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.accessToken).toBeTruthy();
    });
});

describe("POST /auth/bejelentkezes", () => {
    it("bejelentkezik egy fiókkal", async() => {
        const res = await request(app).post("/auth/bejelentkezes").send({
            email: email,
            password: "unit",
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.accessToken).toBeTruthy();
    });
});

afterAll(async() => {
    await db.user.deleteMany({
        where: {
            email,
        }
    });
});
