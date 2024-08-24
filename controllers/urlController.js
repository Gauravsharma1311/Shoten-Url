const urlService = require("../services/urlService");

const storeURL = async (req, res) => {
  const { url } = req.body;
  const userId = req.user.userId; // Get userId from authenticated user

  try {
    const newUrl = await urlService.storeURL(userId, url);
    res.status(201).json({
      message: "URL successfully stored",
      url: {
        id: newUrl.id,
        url: newUrl.url,
        shortenedUrl: newUrl.shortenedUrl,
        userId: newUrl.userId, // Include userId in the response
        createdAt: newUrl.createdAt,
        updatedAt: newUrl.updatedAt,
      },
      status: 201,
    });
  } catch (error) {
    console.error(`Error storing URL: ${error.message}`);
    if (error.message === "URL already exists") {
      res.status(400).json({
        message: "Error storing URL",
        error: error.message,
        status: 400,
      });
    } else {
      res.status(500).json({
        message: "Error storing URL",
        error: error.message,
        status: 500,
      });
    }
  }
};

// Fetch URLs and include shortenedUrl in the response
const fetchUrls = async (req, res) => {
  try {
    const filter = req.query;
    const urls = await urlService.fetchUrls(filter);
    res.json({
      message: "URLs fetched successfully",
      urls,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching URLs",
      error: error.message,
      status: 500,
    });
  }
};

const fetchUrlById = async (req, res) => {
  const { id } = req.params;

  try {
    const url = await urlService.fetchUrlById(id);
    if (url) {
      res.json({
        message: "URL fetched successfully",
        url,
        status: 200,
      });
    } else {
      res.status(404).json({
        message: "URL not found",
        status: 404,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error fetching URL",
      error: error.message,
      status: 500,
    });
  }
};

const updateURL = async (req, res) => {
  const { id } = req.params;
  const { url } = req.body;

  try {
    const updatedUrl = await urlService.updateURL(id, url);
    res.json({
      message: "URL successfully updated",
      url: updatedUrl,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating URL",
      error: error.message,
      status: 500,
    });
  }
};

const deleteURL = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUrl = await urlService.deleteURL(id);
    res.json({
      message: "URL successfully deleted",
      url: deletedUrl,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting URL",
      error: error.message,
      status: 500,
    });
  }
};

const fetchUsernames = async (req, res) => {
  try {
    const usernames = await urlService.fetchUsernames();
    res.json({
      message: "Usernames fetched successfully",
      usernames,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching usernames",
      error: error.message,
      status: 500,
    });
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
