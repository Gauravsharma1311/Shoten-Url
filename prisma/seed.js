// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const adminRole = await prisma.role.create({
    data: {
      name: "admin",
      permissions: {
        create: [
          {
            name: "manage_users",
            actions: {
              create: [
                { name: "create_user" },
                { name: "view_user" },
                { name: "update_user" },
                { name: "delete_user" },
              ],
            },
          },
        ],
      },
    },
  });

  const userRole = await prisma.role.create({
    data: {
      name: "user",
      permissions: {
        create: [
          {
            name: "view_profile",
            actions: {
              create: [{ name: "view_user" }],
            },
          },
        ],
      },
    },
  });

  console.log({ adminRole, userRole });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
