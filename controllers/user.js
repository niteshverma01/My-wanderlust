const User = require("../models/user");


module.exports.renderSignup = (req,res) => {
    res.render("users/signup.ejs");
    };

module.exports.signUp = async(req,res)=>{
    try{
        let{ username ,email,password} = req.body;
    const newUser = new User({email,username});
    const registerUser = await User.register(newUser,password);
    console.log(registerUser);
    req.login(registerUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","welcome to wanderlust!");
        res.redirect("/listings");
    });
        
    } catch(e) {
    req.flash("error", e.message);
    res.redirect("/signup");
    }
   };
   module.exports.renderLogin = (req,res) => {
    res.render("users/login.ejs");
    };

    
module.exports.login = async(req, res)=>{
        req.flash("success","welcome back to wanderlust! Login successful");
          let redirectUrl = res.locals.redirectUrl || "/listings";
           res.redirect(redirectUrl);
       };
    module.exports.logout =(req, res, next) =>{
        req.logout((err) => {
            if(err){
                return next(err);
            }
            req.flash("success", "You are logged out!");
            res.redirect("/listings");
        });
    };
