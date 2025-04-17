const express = require("express");
const router = express.Router();
const eventsController= require("../Controllers/eventsController");

//public 
router.get("/api/v1/events",eventsController.getAllEvents())


