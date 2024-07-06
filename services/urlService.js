const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const storeURL = async (userId, url) => {
  // Include customerId
  const newUrl = await prisma.url.create({
    data: { userId: parseInt(userId), url }, // Ensure customerId is parsed and included
  });
  return newUrl;
};

const fetchUrls = async () => {
  const urls = await prisma.url.findMany();
  return urls;
};

module.exports = { storeURL, fetchUrls };
