const express = require("express");
const router = express.Router();
const flash = require("express-flash");
const assert = require("assert");
const mongo = require("mongodb");

const bodyParser = require("body-parser"); //
const urlencodedParser = bodyParser.urlencoded({ extended: false }); //

//mongodb user model
const User = require("../models/User");
const Answer = require("../models/Ans");

//password handler
const bcrypt = require("bcrypt");
const { readdir } = require("fs");

router.use(express.json());
router.use(flash());

router.post("/logSystem/signUp", urlencodedParser, (req, res) => {
  let { name, email, password } = req.body;
  name = name.trim();
  email = email.trim();
  password = password.trim();

  if (name == "" || email == "" || password == "") {
    console.log("Empty input fields!!");
  } else if (!/^[a-zA-Z ]*$/.test(name)) {
    console.log("Invalid name entdred");
  } else {
    User.find({ email })
      .then((result) => {
        if (result.length) {
          console.log("User with the provided email already exists");
          req.session.message = "5"; //User with the provided email already exists
          res.redirect("/logSystem/signUp");
        } else {
          const saltRounds = 10;
          bcrypt
            .hash(password, saltRounds)
            .then((hashedPassword) => {
              const newUser = new User({
                name,
                email,
                password: hashedPassword,
              });
              newUser
                .save()
                .then((result) => {
                  res.redirect("/logSystem/logIn");
                  console.log("signup successful");
                  req.session.message = "0";
                })
                .catch((err) => {
                  console.log("An error occurred while user account");
                  res.redirect("/logSystem/signUp");
                });
            })
            .catch((err) => {
              console.log("An error occurred while hashing password");
              res.redirect("/logSystem/signUp");
            });
        }
      })
      .catch((err) => {
        console.log(err);
        console.log("An error occurred while checking for existing user!");
        res.redirect("/logSystem/signUp");
      });
  }
});

router.post("/logSystem/logIn", urlencodedParser, (req, res) => {
  let { name, password } = req.body;
  //console.log(name, password);
  if (!name || !password) {
    res.redirect("/logSystem/logIn");
    return;
  }
  name = name.trim();
  password = password.trim();

  if (name == "" || password == "") {
    console.log("Empty credentials supplied");
    req.session.message = "1"; //Empty credentials supplied
  }
  // check if user exist
  User.find({ name })
    .then((data) => {
      if (data.length) {
        //user exist
        const hashedPassword = data[0].password;
        bcrypt
          .compare(password, hashedPassword)
          .then((result) => {
            if (result) {
              //password match
              async function findEmail() {
                await User.findOne({ name: name }, function (err, users) {
                  if (err) throw err;
                  req.session.email = users.email;
                  req.session.searchGrade = users.searchExam;
                  req.session.treeGrade = users.treeExam;
                  req.session.basicsGrade = users.basicsExam;
                  req.session.treeerrorAns = users.treeerrorAns;
                  req.session.basicserrorAns = users.basicserrorAns;
                  req.session.searcherrorAns = users.searcherrorAns;
                  res.redirect("/");
                })
                  .clone()
                  .catch(function (err) {
                    console.log(err);
                  });
              }
              findEmail();
              console.log("logIn successful");
              req.session.message = "0";
              req.session.user = name;
              req.session.password = password;
            } else {
              console.log("Invalid password entered");
              req.session.message = "2"; //Invalid password entered
              res.redirect("/logSystem/logIn");
            }
          })
          .catch((err) => {
            console.log("An error occurred while comparing");
            res.redirect("/logSystem/logIn");
          });
      } else {
        console.log("Invalid credentials entered");
        req.session.message = "3"; //Invalid credentials entered
        res.redirect("/logSystem/logIn");
      }
    })
    .catch((err) => {
      console.log("An error occurred while checking for existing user");
      req.session.message = "4"; //An error occurred while checking for existing user
      res.redirect("/logSystem/logIn");
    });
});

router.post("/logSystem/modify", urlencodedParser, (req, res) => {
  let { name, password } = req.body;
  name = name.trim();
  password = password.trim();
  if (name == "" || password == "") {
    console.log("Empty credentials supplied");
  } else {
    User.find({ name })
      .then((result) => {
        if (result.length) {
          console.log("User with the provided name already exists");
          req.session.message = "6"; //User with the provided email already exists
          res.redirect("/logSystem/modify");
        } else {
          const saltRounds = 10;
          bcrypt.hash(password, saltRounds).then((hashedPassword) => {
            User.updateOne(
              { name: req.session.user },
              { $set: { name: name, password: hashedPassword } },
              { w: 1 },
              function (err, result) {
                if (err) throw err;
                req.session.user = name;
                req.session.password = password;
                req.session.message = "0";
                console.log("更新成功！");
                res.redirect("/");
              }
            );
          });
        }
      })
      .catch((err) => {
        console.log(err);
        console.log("An error occurred while checking for existing user!");
        res.redirect("/logSystem/modify");
      });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

//examSystem
router.post("/exam/searchExam", urlencodedParser, async (req, res) => {
  let userAns = [].fill(null);
  userAns.push(req.body.question1);
  userAns.push(req.body.question2);
  userAns.push(req.body.question3);
  userAns.push(req.body.question4);
  userAns.push(req.body.question5);
  let testAns = [];
  // let errorAns = [];
  // let errorNumber = 0;
  let errorAns = "";
  let grade = 0;
  console.log(userAns);
  Answer.findOne({ _id: "61c9c609e89f30d9478249f4" }, function (err, ans) {
    if (err) throw err;
    //console.log(ans.Ans);
    testAns = ans.Ans;
    for (let i = 1; i <= userAns.length; i++) {
      if (testAns[i] === userAns[i]) {
        grade += 20;
      } else {
        errorAns += i.toString();
        errorAns += ",";
      }
      errorAns.slice(0, errorAns.length - 1);
    }
    User.updateOne(
      { name: req.session.user },
      { $set: { searchExam: grade } },
      { w: 1 },
      function (err, result) {
        if (err) throw err;
      }
    );
    User.updateOne(
      { name: req.session.user },
      { $set: { searcherrorAns: errorAns.slice(0, errorAns.length - 1) } },
      { w: 1 },
      function (err, result) {
        if (err) throw err;
        console.log("成績寫入成功");
        req.session.searchGrade = grade;
        req.session.searcherrorAns = errorAns.slice(0, errorAns.length - 1);
        console.log(req.session.searchGrade);
        res.redirect("/logSystem/user");
      }
    );
  });
});

router.post("/exam/basicsExam", urlencodedParser, async (req, res) => {
  let userAns = [].fill(null);
  let a = "";
  a =
    req.body.question1array1 +
    "," +
    req.body.question1array2 +
    "," +
    req.body.question1array3;
  userAns.push(a);
  a =
    req.body.question2link1 +
    "," +
    req.body.question2link2 +
    "," +
    req.body.question2link3;
  userAns.push(a);
  userAns.push(req.body.question3);
  userAns.push(req.body.question4);
  userAns.push(req.body.question5);
  userAns.push(req.body.question6);
  userAns.push(req.body.question7);
  userAns.push(req.body.question8);
  userAns.push(req.body.question9);
  userAns.push(req.body.question10);
  let testAns = [];
  let errorAns = "";
  let grade = 0;
  Answer.findOne(
    { _id: "61cd194cf980105241f25152" },
    await function (err, ans) {
      if (err) throw err;
      //console.log(ans.Ans);
      testAns = ans.Ans;
      for (let i = 1; i <= userAns.length; i++) {
        if (testAns[i] === userAns[i]) {
          grade += 10;
        } else {
          errorAns += i.toString();
          errorAns += ",";
        }
        errorAns.slice(0, errorAns.length - 1);
      }
      User.updateOne(
        { name: req.session.user },
        { $set: { basicserrorAns: errorAns.slice(0, errorAns.length - 1) } },
        { w: 1 },
        function (err, result) {
          if (err) throw err;
        }
      );
      User.updateOne(
        { name: req.session.user },
        { $set: { basicsExam: grade } },
        { w: 1 },
        function (err, result) {
          if (err) throw err;
          console.log("成績寫入成功");
          req.session.basicsGrade = grade;
          req.session.basicserrorAns = errorAns.slice(0, errorAns.length - 1);
          res.redirect("/logSystem/user");
        }
      );
    }
  );
});

router.post("/exam/treeExam", urlencodedParser, async (req, res) => {
  let userAns = [].fill(null);
  userAns.push(req.body.question1);
  userAns.push(req.body.question2);
  userAns.push(req.body.question3);
  userAns.push(req.body.question4);
  userAns.push(req.body.question5);
  userAns.push(req.body.question6);
  userAns.push(req.body.question7);
  userAns.push(req.body.question8);
  userAns.push(req.body.question9);
  userAns.push(req.body.question10);
  let testAns = [];
  let errorAns = "";
  let grade = 0;
  Answer.findOne(
    { _id: "61cd1b8531d4a8a353e04e4a" },
    await function (err, ans) {
      if (err) throw err;
      //console.log(ans.Ans);
      testAns = ans.Ans;
      for (let i = 1; i <= userAns.length; i++) {
        if (testAns[i] === userAns[i]) {
          grade += 10;
        } else {
          errorAns += i.toString();
          errorAns += ",";
        }
        errorAns.slice(0, errorAns.length - 1);
      }
      User.updateOne(
        { name: req.session.user },
        { $set: { treeerrorAns: errorAns.slice(0, errorAns.length - 1) } },
        { w: 1 },
        function (err, result) {
          if (err) throw err;
        }
      );
      User.updateOne(
        { name: req.session.user },
        { $set: { treeExam: grade } },
        { w: 1 },
        function (err, result) {
          if (err) throw err;
          console.log("成績寫入成功");
          req.session.treeGrade = grade;
          req.session.treeerrorAns = errorAns.slice(0, errorAns.length - 1);
          res.redirect("/logSystem/user");
        }
      );
    }
  );
});

router.post("/exam/graphExam", urlencodedParser, async (req, res) => {
  let userAns = [].fill(null);
  userAns.push(req.body.question1);
  userAns.push(req.body.question2);
  userAns.push(req.body.question3);
  userAns.push(req.body.question4);
  userAns.push(req.body.question5);
  userAns.push(req.body.question6);
  userAns.push(req.body.question7);
  userAns.push(req.body.question8);
  userAns.push(req.body.question9);
  userAns.push(req.body.question10);
  let testAns = [];
  let grade = 0;
  Answer.findOne(
    { _id: "61cd1b8531d4a8a353e04e4b" },
    await function (err, ans) {
      if (err) throw err;
      //console.log(ans.Ans);
      testAns = ans.Ans;
      for (let i = 0; i < userAns.length; i++) {
        if (testAns[i] === userAns[i]) {
          grade += 10;
        }
      }
      User.updateOne(
        { name: req.session.user },
        { $set: { graphExam: grade } },
        { w: 1 },
        function (err, result) {
          if (err) throw err;
          console.log("成績寫入成功");
          res.redirect("/");
        }
      );
      console.log("test:" + testAns);
      console.log("user" + userAns);
      console.log(grade);
    }
  );
});

module.exports = router;
// Answer.find({ Ans });
// const newAns = new Answer({
//   name: "searchExam",
//   Ans: ["A", "C", "D", "B", "A", "C", "B", "D", "B", "A"],
// });
// newAns.save();
