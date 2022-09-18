const express = require("express")
const router = express.Router()
const clientController = require("./clientController")

// Get any endpoint - serve front end
router.get("*", clientController.serveFrontend)

module.exports = router