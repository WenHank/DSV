const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
  basicsExam: String,
  basicserrorAns: String,
  searchExam: String,
  searcherrorAns: String,
  graphExam: String,
  treeExam: String,
  treeerrorAns: String,
});
const User = mongoose.model("User", UserSchema);
module.exports = User;
