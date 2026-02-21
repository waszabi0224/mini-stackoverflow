import prisma from "../src/db/prisma.js";
import { Role, Gender } from "@prisma/client";

async function main() {
    const alice = await prisma.user.upsert({
        where: { email: "arbbbbfbeit@prisma.io" },
        update: {},
        create: {
            email: "arbbbbfbeit@prisma.io",
            username: "Alicfffffeff1234",
            password: "jelszfo",
            role: Role.ADMIN,
            birthDate: new Date("2003-04-24"),
            gender: Gender.MALE,
        },
    });
    console.log({ alice });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
