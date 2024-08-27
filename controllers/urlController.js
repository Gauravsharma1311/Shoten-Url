const urlService = require("../services/urlService");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const storeURL = async (req, res) => {
  try {
    const newUrl = await urlService.storeURL(req.user.userId, req.body.url);
    res.status(201).json({ message: "URL stored", url: newUrl, status: 201 });
  } catch (error) {
    res
      .status(error.message === "URL already exists" ? 400 : 500)
      .json({ message: "Error storing URL", error: error.message });
  }
};

const fetchUrls = async (req, res) => {
  const { pageNumber = 1, pageSize = 10, ...filters } = req.query;
  const skip = (pageNumber - 1) * pageSize;
  try {
    const [totalCount, urls] = await prisma.$transaction([
      prisma.url.count({ where: filters }),
      prisma.url.findMany({ where: filters, skip, take: parseInt(pageSize) }),
    ]);
    res.json({
      message: "URLs fetched",
      data: {
        urls,
        pagination: {
          pageNumber,
          pageSize,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
        },
      },
      status: 200,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching URLs", error: error.message });
  }
};

const fetchUrlById = async (req, res) => {
  try {
    const url = await urlService.fetchUrlById(req.params.id);
    url
      ? res.json({ message: "URL fetched", url, status: 200 })
      : res.status(404).json({ message: "URL not found", status: 404 });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching URL", error: error.message });
  }
};

const updateURL = async (req, res) => {
  try {
    const updatedUrl = await urlService.updateURL(req.params.id, req.body.url);
    res.json({ message: "URL updated", url: updatedUrl, status: 200 });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating URL", error: error.message });
  }
};

const deleteURL = async (req, res) => {
  try {
    const deletedUrl = await urlService.deleteURL(req.params.id);
    res.json({ message: "URL deleted", url: deletedUrl, status: 200 });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting URL", error: error.message });
  }
};

const fetchUsernames = async (req, res) => {
  try {
    const usernames = await urlService.fetchUsernames();
    res.json({ message: "Usernames fetched", usernames, status: 200 });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching usernames", error: error.message });
  }
};

module.exports = {
  storeURL,
  fetchUrls,
  fetchUrlById,
  updateURL,
  deleteURL,
  fetchUsernames,
};
