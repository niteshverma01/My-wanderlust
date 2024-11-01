if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const User = require("./models/user.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const user = require("./routes/user.js");

const app = express();
const dbUrl = process.env.ATLASDB_URL;

// Set view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});
store.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

// Session and flash
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// MongoDB connection
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(dbUrl);
  console.log("Connected to MongoDB");
}

// Middleware for flash messages
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Routes
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", user);

// Home route
// app.get("/", (req, res) => {
//   res.send("Working");
// });

// Handle 404 errors
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("listings/error.ejs", { message });
});

// Start server
app.listen(3000, () => {
  // Changed to port 3000
  console.log("App is listening on port 3000");
});
