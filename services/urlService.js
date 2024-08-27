const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const generateShortenedUrl = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let shortenedUrl = "";

  for (let i = 0; i < 5; i++) {
    shortenedUrl += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return shortenedUrl;
};

const storeURL = async (userId, url) => {
  try {
    let shortenedUrl;
    do {
      shortenedUrl = generateShortenedUrl();
    } while (await prisma.url.findUnique({ where: { shortenedUrl } }));

    return await prisma.url.create({ data: { url, shortenedUrl, userId } });
  } catch (error) {
    if (error.code === "P2002") throw new Error("URL already exists");
    throw error;
  }
};

const fetchUrls = (filter) => prisma.url.findMany({ where: filter });

const fetchUrlById = (id) => prisma.url.findUnique({ where: { id } });

const updateURL = (id, url) =>
  prisma.url.update({ where: { id }, data: { url } });

const deleteURL = (id) => prisma.url.delete({ where: { id } });

const fetchUsernames = () =>
  prisma.user.findMany({ select: { id: true, username: true } });

module.exports = {
  storeURL,
  fetchUrls,
  fetchUrlById,
  updateURL,
  deleteURL,
  fetchUsernames,
};
