const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const storeURL = async (userId, url) => {
  try {
    const newUrl = await prisma.url.create({
      data: { userId: userId.toString(), url },
    });
    return newUrl;
  } catch (error) {
    if (error.code === "P2002") {
      // Unique constraint violation
      throw new Error("URL already exists for this user");
    }
    throw error;
  }
};

const fetchUrls = async () => {
  const urls = await prisma.url.findMany();
  return urls;
};

module.exports = { storeURL, fetchUrls };
