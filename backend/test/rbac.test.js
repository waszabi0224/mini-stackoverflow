import app from "../src/app.js";
import request from "supertest";
import { beforeAll, it, expect, afterAll } from "vitest";
import { Role, Gender } from "@prisma/client";
import db from "../src/db/prisma.js";

const email1 = "unittestUSER1@gmail.com";
const username1 = "USER1";
const email2 = "unittestUSER2@gmail.com";
const username2 = "USER2";
const email3 = "unittestADMIN@gmail.com";
const username3 = "ADMIN";
const roleU = Role.USER;
const roleA = Role.ADMIN;
let token1;
let token2;
let tokenAdmin;
let ticketId;
let commentId;

async function registerAndlogin(email, username, role) {
    await request(app).post("/auth/regisztracio").send({
        email: email,
        username: username,
        password: "unit",
        role: role,
        birthDate: "2003-02-24",
        gender: Gender.FEMALE,
    });
    const res = await request(app).post("/auth/bejelentkezes").send({
        email: email,
        password: "unit",
    });
    return res.body.accessToken;
}

//beforeAll USER1 létrehoz egy ticketet és hozzá commentet
beforeAll(async() => {
    token1 = await registerAndlogin(email1, username1, roleU);
    const ticket = await request(app).post("/tickets").set("Authorization", `Bearer ${token1}`).send({
        title: "role teszt ticket",
        description: "teszt ticket role mukodese",
    });

    ticketId = ticket.body.ticket.id;

    const comment = await request(app).post(`/comments/${ticketId}`).set("Authorization", `Bearer ${token1}`).send({
        text: "ez egy teszt comment",
    });

    commentId = comment.body.comment.id;

    expect(ticket.statusCode).toBe(200);
    expect(ticket.body.ticket).toBeTruthy();
    expect(comment.statusCode).toBe(200);
    expect(comment.body.comment).toBeTruthy();
});

it("USER2 módosítja USER1 ticketjét", async() => {
    token2 = await registerAndlogin(email2, username2, roleU);
    const ticket = await request(app).patch(`/tickets/${ticketId}`).set("Authorization", `Bearer ${token2}`).send({
        title: "modositott ticket",
        description: "USER2 modositani akarja USER1 ticketjet",
    });

    expect(ticket.statusCode).toBe(403);
});

it("ADMIN módosítja USER1 ticketjét", async() => {
    tokenAdmin = await registerAndlogin(email3, username3, roleA);
    const ticket = await request(app).patch(`/tickets/${ticketId}`).set("Authorization", `Bearer ${tokenAdmin}`).send({
        title: "modositott ticket",
        description: "ADMIN modositani akarja USER1 ticketjet",
    });

    expect(ticket.statusCode).toBe(200);
    expect(ticket.body.ticket).toBeTruthy();
});

it("USER2 törölni akarja USER1 commentjét", async() => {
    const comment = await request(app).delete(`/comments/${commentId}`).set("Authorization", `Bearer ${token2}`);

    expect(comment.statusCode).toBe(403);
});

it("ADMIN törölni akarja USER1 commentjét", async() => {
    const comment = await request(app).delete(`/comments/${commentId}`).set("Authorization", `Bearer ${tokenAdmin}`);

    expect(comment.statusCode).toBe(200);
    expect(comment.body.comment).toBeTruthy();
});

afterAll(async() => {
    await db.user.deleteMany({
        where: {
            email: {
                in: [email1, email2, email3],
            }
        },
    });
});
