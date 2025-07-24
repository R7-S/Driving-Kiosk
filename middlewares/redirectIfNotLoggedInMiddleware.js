module.exports = (req , res , next) => {
    console.log("if not login", req.session.userId)

    if (req.session.userId) {
        next();
    }
    else{
        return res.redirect("/"); 
    }
};