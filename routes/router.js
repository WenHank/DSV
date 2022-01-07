const express = require("express");
//const { readdir } = require("fs");
const router = express.Router();

router.get("/", (req, res) => {
  //console.log(req.session.user);
  console.log(req.originalUrl);
  // if (req.session.user) res.render("index", { name: req.session.user });
  res.render("index", { name: req.session.user });
});

router.get("/:where/:type", (req, res) => {
  console.log(req.session.email);
  if (
    req.params.where === "exam" &&
    req.params.type === "searchExam" &&
    req.session.user == undefined
  ) {
    res.redirect("/logSystem/logIn");
  } else if (
    req.params.where === "exam" &&
    req.params.type === "basicsExam" &&
    req.session.user == undefined
  ) {
    res.redirect("/logSystem/logIn");
  } else if (
    req.params.where === "exam" &&
    req.params.type === "graphExam" &&
    req.session.user == undefined
  ) {
    res.redirect("/logSystem/logIn");
  } else if (
    req.params.where === "exam" &&
    req.params.type === "treeExam" &&
    req.session.user == undefined
  ) {
    res.redirect("/logSystem/logIn");
  } else {
    res.render(`${req.params.where}/${req.params.type}`, {
      name: req.session.user,
      password: req.session.password,
      email: req.session.email,
      message: req.session.message,
      searchGrade: req.session.searchGrade,
      basicsGrade: req.session.basicsGrade,
      treeGrade: req.session.treeGrade,
      searcherrorAns: req.session.searcherrorAns,
      basicserrorAns: req.session.basicserrorAns,
      treeerrorAns: req.session.treeerrorAns,
    });
  }
});

module.exports = router;
