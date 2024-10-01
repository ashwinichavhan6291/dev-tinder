const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://AshwiniChavhan:eV5TuKSO9G2HTXjw@namastenode.4nzgu.mongodb.net/devTinder"
  );
};

module.exports = { connectDB };
