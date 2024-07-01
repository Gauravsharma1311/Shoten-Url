const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const storeURL = async (userId, url) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Invalid userId");

  return await prisma.URL.create({ data: { userId, url } });
};

const fetchUrls = async () => {
  return await prisma.URL.findMany();
};

module.exports = { storeURL, fetchUrls };
