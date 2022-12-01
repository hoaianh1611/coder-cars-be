const express = require("express");
const {
  createCar,
  getCars,
  getSingleCar,
  editCar,
  deleteCar,
  // importCar,
} = require("../controllers/car.controller");
const router = express.Router();

// CREATE
router.post("/", createCar);

// READ
router.get("/", getCars);
router.get("/:id", getSingleCar);

// UPDATE
router.put("/:id", editCar);

// DELETE
router.delete("/:id", deleteCar);

// Import
// router.post("/add", importCar);

module.exports = router;
