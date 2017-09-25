const express = require("express")
const path = require("path")
const favicon = require("serve-favicon")
const logger = require("morgan")
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const passport = require("passport")
const util = require("util")
const session = require("express-session")
const methodOverride = require("method-override")
const GitHubStrategy = require("passport-github2").Strategy
const partials = require("express-partials")

var GITHUB_CLIENT_ID = "6c2d66a88492aed90f45"
var GITHUB_CLIENT_SECRET = "67c7ab41bafbb9e64cc10ba9dd6516a6db18993e"

const index = require("./routes/index")
const passportLogin = require("./routes/passportLogin") //(app)

const app = express()

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"))
app.use(bodyParser.json())
app.use(partials())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))
app.use(session({ secret: "keyboard cat", resave: false, saveUninitialized: false }))

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(__dirname + "/public"))
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect("/login")
}
app.use("/", index)
app.use("/passportLogin", passportLogin)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error("Not Found")
  err.status = 404
  next(err)
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render("error")
})

module.exports = app
