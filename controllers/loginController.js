
const User = require("../models/User");
const bcrypt = require("bcrypt");

const loginPage = (req, res) => {
  res.render("login");
};

const loginCreate = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    console.log("USER >>>", user);
    if (user != null) {
      const passwordsMatch = await bcrypt.compare(
        req.body.password,
        user.password
      );
      console.log("match >>>", passwordsMatch);

      if (passwordsMatch) {
        req.session.userType = user.userType;
        req.session.userId = user._id;
        req.session.username = user.username;
        if (user.userType === "driver") {
          return res.redirect("/g_test"); 
        } else if (user.userType === "Examiner") {
          return res.redirect("/examiner-dashboard");
        } else if (user.userType === "Admin") {
          return res.redirect("/appointment");
        } else {
          return res.redirect("/"); 
        }
      } else {
        res.redirect("/login");
      }
    } else {
      return res.redirect("/login");
    }
  } catch (error) {
    console.log(error);
    return res.redirect("/login");
  }
};

const logOut = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

module.exports = { loginPage, loginCreate, logOut };
