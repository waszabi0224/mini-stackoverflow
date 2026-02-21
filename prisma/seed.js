import pkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const { PrismaClient, Role, Gender } = pkg;

/*const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});*/

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });
async function main() {
    const alice = await prisma.user.upsert({
        where: { email: "arbbbbeit@prisma.io" },
        update: {},
        create: {
            email: "arbbbbeit@prisma.io",
            username: "Alicfffeff1234",
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
