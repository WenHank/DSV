const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  Ans: Array,
});
const Anser = mongoose.model("Ans", UserSchema);
module.exports = Anser;
