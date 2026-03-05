import app from "../src/app.js";
import request from "supertest";
import { beforeAll, it, expect, afterAll } from "vitest";
import { Role, Gender } from "@prisma/client";
import db from "../src/db/prisma.js";

const email = "unittestCOMMENT@gmail.com";

async function registerAndlogin() {
    await request(app).post("/auth/regisztracio").send({
        email: email,
        username: "unittestCOMMENT",
        password: "unit",
        role: Role.USER,
        birthDate: "2003-02-24",
        gender: Gender.FEMALE,
    });
    const res = await request(app).post("/auth/bejelentkezes").send({
        email: email,
        password: "unit",
    });
    return res.body.accessToken;
}

let commentId;
let token;

//beforeAll létrehoz egy commentet
beforeAll(async() => {
    token = await registerAndlogin();
    const ticket = await request(app).post("/tickets").set('Authorization', `Bearer ${token}`).send({
        title: "teszt ticket",
        description: "ez egy teszt ticket létrehozása",
    });

    const ticketId = ticket.body.ticket.id;

    const res = await request(app).post(`/comments/${ticketId}`).set('Authorization', `Bearer ${token}`).send({
        text: "ez egy teszt comment",
    });

    commentId = res.body.comment.id;

    expect(res.statusCode).toBe(200);
    expect(res.body.comment).toBeTruthy();
});

it("módosít egy commentet", async() => {
    const res = await request(app).patch(`/comments/${commentId}`).set("Authorization", `Bearer ${token}`).send({
        text: "ez egy modositott teszt comment",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.comment).toBeTruthy();
});

it("töröl egy commentet", async() => {
    const res = await request(app).delete(`/comments/${commentId}`).set("Authorization", `Bearer ${token}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.comment).toBeTruthy();
});

afterAll(async() => {
    await db.user.deleteMany({
        where: {
            email,
        }
    });
});
