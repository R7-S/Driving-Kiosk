
const User = require("../models/User");


const registerPage = (req, res) => {
    res.render("register");
  };




const register_create = async (req, res)  => {
    console.log (req.body);

    const user = {
        username: req.body.username,
        password: req.body.password,
        userType: req.body.userType,
    };

    await User.create(user);
    res.redirect("/login");


}


module.exports =  {register_create , registerPage
};