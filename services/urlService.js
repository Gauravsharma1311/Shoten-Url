const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const generateShortenedUrl = () => {
  return Math.random().toString(36).substring(2, 8);
};

const storeURL = async (userId, url) => {
  try {
    let shortenedUrl = generateShortenedUrl();

    // Ensure the shortened URL is unique
    let existingUrl = await prisma.url.findUnique({
      where: { shortenedUrl },
    });

    while (existingUrl) {
      shortenedUrl = generateShortenedUrl();
      existingUrl = await prisma.url.findUnique({
        where: { shortenedUrl },
      });
    }

    const newUrl = await prisma.url.create({
      data: { userId: userId.toString(), url, shortenedUrl },
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
  return await prisma.url.findMany();
};

const fetchUrlById = async (id) => {
  return await prisma.url.findUnique({
    where: { id },
  });
};

const updateURL = async (id, url) => {
  try {
    return await prisma.url.update({
      where: { id },
      data: { url },
    });
  } catch (error) {
    if (error.code === "P2025") {
      throw new Error("URL not found");
    }
    throw error;
  }
};

const deleteURL = async (id) => {
  try {
    const deletedUrl = await prisma.url.delete({
      where: { id },
    });
    return deletedUrl;
  } catch (error) {
    if (error.code === "P2025") {
      throw new Error("URL not found");
    }
    throw error;
  }
};

const getUserByUsername = async (username) => {
  return await prisma.user.findUnique({
    where: { username },
  });
};

const fetchUsernames = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      username: true,
    },
  });
};

module.exports = {
  storeURL,
  fetchUrls,
  fetchUrlById,
  updateURL,
  deleteURL,
  getUserByUsername,
  fetchUsernames,
};
