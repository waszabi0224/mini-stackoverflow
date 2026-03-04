import app from "../src/app.js";
import request from "supertest";
import { beforeAll, it, expect, afterAll } from "vitest";
import { Role, Gender } from "@prisma/client";
import db from "../src/db/prisma.js";

const email = "unittestTICKET@gmail.com";

async function registerAndlogin() {
    await request(app).post("/auth/regisztracio").send({
        email: email,
        username: "unittestTICKET",
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

let ticketId;
let token;

//beforeAll létrehoz egy ticketet
beforeAll(async() => {
    token = await registerAndlogin();
    const res = await request(app).post("/tickets").set('Authorization', `Bearer ${token}`).send({
        title: "teszt ticket",
        description: "ez egy teszt ticket létrehozása",
    });

    ticketId = res.body.ticket.id;

    expect(res.statusCode).toBe(200);
    expect(res.body.ticket).toBeTruthy();
});

it("módosít egy ticketet", async() => {
    const res = await request(app).patch(`/tickets/${ticketId}`).set("Authorization", `Bearer ${token}`).send({
        title: "modosított teszt ticket",
        description: "ez egy modosított teszt ticket",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.ticket).toBeTruthy();
});

it("töröl egy ticketet", async() => {
    const res = await request(app).delete(`/tickets/${ticketId}`).set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.ticket).toBeTruthy();
});

afterAll(async() => {
    await db.user.deleteMany({
        where: {
            email,
        }
    });
});
