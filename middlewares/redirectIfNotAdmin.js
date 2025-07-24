module.exports = (req , res , next) => {
    console.log("if not Admin", req.session.userType)
    if (req.session.userType == "Admin") {
        next();
    }
    else{
        return res.redirect("/"); 
    }
};