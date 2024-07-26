const urlService = require("../services/urlService");

const storeURL = async (req, res) => {
  const { userId, url } = req.body;

  try {
    const newUrl = await urlService.storeURL(userId, url);
    res.status(201).json({
      message: "URL successfully stored",
      url: newUrl,
      status: 201,
    });
  } catch (error) {
    if (error.message === "URL already exists for this user") {
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

const fetchUrls = async (req, res) => {
  try {
    const urls = await urlService.fetchUrls();
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

module.exports = { storeURL, fetchUrls };
