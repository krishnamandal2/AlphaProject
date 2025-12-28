const rateLimit = require("express-rate-limit");

// 🔐 LOGIN LIMITER (Brute-force protection)
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // max 5 attempts
  message: {
    msg: "Too many login attempts. Try again after 10 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false
});

// 🔁 REFRESH TOKEN LIMITER
const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    msg: "Too many refresh requests. Please wait."
  }
});

// 🌍 GENERAL API LIMITER  or for all appi
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests
});

module.exports = {
  loginLimiter,
  refreshLimiter,
  apiLimiter
};
