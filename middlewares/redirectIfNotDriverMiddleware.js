module.exports = (req , res , next) => {
    console.log("if not driver", req.session.userType)
    if (req.session.userType == "driver") {
        next();
    }
    else{
        return res.redirect("/"); 
    }
};