const mongoose = require("mongoose");
const Car = require("../models/Car");
const carController = {};

carController.createCar = async (req, res, next) => {
  try {
    // YOUR CODE HERE
    const {
      make,
      model,
      release_date,
      transmission_type,
      size,
      style,
      price,
      isDeleted,
    } = req.body;

    if (
      !make ||
      !model ||
      !release_date ||
      !transmission_type ||
      !size ||
      !style ||
      !price
    ) {
      const exception = new Error(`Missing body info`);
      exception.statusCode = 401;
      throw exception;
    }

    const newCar = await new Car({
      make: make,
      model: model,
      release_date: release_date,
      transmission_type: transmission_type,
      size: size,
      style: style,
      price: price,
      isDeleted: false,
    }).save();

    const response = {
      message: "Create Car Successfully!",
      car: newCar,
    };

    res.status(200).send(response);
  } catch (err) {
    // YOUR CODE HERE
    next(err);
  }
};

carController.getCars = async (req, res, next) => {
  const allowedFilter = [
    "make",
    "model",
    "size",
    "style",
    "price",
    "page",
    "limit",
  ];

  try {
    // YOUR CODE HERE
    let { page, limit, ...filterQuery } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const totalCars = await Car.find({ isDeleted: false });
    let result = [];

    const filterKeys = Object.keys(filterQuery);
    let offset = limit * (page - 1);

    filterKeys.forEach((key) => {
      if (!allowedFilter.includes(key)) {
        const exception = new Error(`Query ${key} is not allowed`);
        exception.statusCode = 401;
        throw exception;
      }
      if (!filterQuery[key]) delete filterQuery[key];
    });

    if (filterKeys.length) {
      filterKeys.forEach((condition) => {
        console.log(condition);
        console.log(filterQuery[condition]);
        result = result.length
          ? (result = result.filter((car) => {
              car[condition] == filterQuery[condition];
            }))
          : (result = totalCars.filter((car) => {
              car[condition] == filterQuery[condition];
            }));
      });
    } else {
      result = totalCars;
    }
    result = totalCars;

    const response = {
      message: "Get Car List Successfully!",
      cars: result.slice(offset, offset + limit),
      page: page,
      total: parseInt(result.length / 10),
    };
    res.status(200).send(response);
  } catch (err) {
    // YOUR CODE HERE
    next(err);
  }
};

carController.getSingleCar = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    const car = await Car.findById(id);

    const response = {
      message: "Get Car Successfully!",
      cars: car,
    };
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

carController.editCar = async (req, res, next) => {
  try {
    // YOUR CODE HERE
    const { id } = req.params;
    const edit = req.body;

    //find and update by id
    const updateCar = await Car.findByIdAndUpdate(
      id,
      { ...edit },
      { new: true }
    );

    const response = {
      message: "Update Car Successfully!",
      updateCar,
    };
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

carController.deleteCar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteCar = await Car.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    const response = {
      message: "Delete Car Successfully!",
      deleteCar,
    };
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

module.exports = carController;
