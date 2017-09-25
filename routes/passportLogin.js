const express = require("express")
const passportLogin = express.Router()
const passport = require("passport")
const util = require("util")
const session = require("express-session")
const bodyParser = require("body-parser")
const methodOverride = require("method-override")
const GitHubStrategy = require("passport-github2").Strategy
const partials = require("express-partials")

/* GET users listing. */

passport.serializeUser(function(user, done) {
  done(null, user)
})

passport.deserializeUser(function(obj, done) {
  done(null, obj)
})

var GITHUB_CLIENT_ID = "6c2d66a88492aed90f45"
var GITHUB_CLIENT_SECRET = "67c7ab41bafbb9e64cc10ba9dd6516a6db18993e"

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "http://127.0.0.1:3000/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function() {
        return done(null, profile)
      })
    }
  )
)

passportLogin.get("/", (req, res) => {
  res.render("index", { user: req.user })
})
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect("/login")
}

passportLogin.get("/account", ensureAuthenticated, (req, res) => {
  res.render("account", { user: req.user })
})

passportLogin.get("/login", (req, res) => {
  res.render("login", { user: req.user })
})

passportLogin.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }), (req, res) => {})

passportLogin.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/")
  }
)

passportLogin.get("/logout", (req, res) => {
  req.logout()
  res.redirect("/")
})

module.exports = passportLogin
