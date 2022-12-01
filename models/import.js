const express = require("express");
const csv = require("csvtojson");
const fs = require("fs");
const Car = require("./Car");
const mongoose = require("mongoose");

const importCar = async () => {
  //read file csv -> convert to json
  // let data = JSON.parse(fs.readFileSync("../db.json"));

  mongoose.connect("mongodb://localhost:27017/coder_cars", () => {
    console.log("Connected to Database!");
  });

  let newData = await csv().fromFile("../data.csv");
  newData = Array.from(newData);

  newData = newData.map((e) => {
    return {
      make: e.Make,
      model: e.Model,
      release_date: parseInt(e.Year),
      transmission_type: e["Transmission Type"],
      size: e["Vehicle Size"],
      style: e["Vehicle Style"],
      price: parseInt(e.MSRP),
    };
  });

  // data = newData;

  // fs.writeFileSync("../db.json", JSON.stringify(data));

  await Car.create(newData);

  // const singleCar = await Car.findOne({ isDeleted: false });

  // console.log(singleCar);
};

importCar().catch((err) => console.log(err, "err"));
