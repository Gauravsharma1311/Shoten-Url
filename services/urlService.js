const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const generateShortenedUrl = () => {
  const length = 5; // Length of the shortened URL
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let shortenedUrl = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    shortenedUrl += characters[randomIndex];
  }
  return shortenedUrl;
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
      data: {
        url,
        shortenedUrl,
        userId, // Include userId in the data object
      },
    });

    return newUrl;
  } catch (error) {
    if (error.code === "P2002") {
      // Unique constraint violation
      throw new Error("URL already exists");
    }
    throw error;
  }
};

const fetchUrls = async (filter) => {
  const whereClause = {};

  if (filter.url) {
    whereClause.url = {
      contains: filter.url,
    };
  }

  return await prisma.url.findMany({
    where: whereClause,
  });
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
