module.exports = (req, res, next) => {
  if (req.session.userType === "Examiner") {
    next(); 
  } else {
    res.redirect("/");
  }
};
