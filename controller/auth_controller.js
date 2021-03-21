let database = require("../database");
const express = require("express");

let authController = {
  login: (req, res) => {
    res.render("auth/login");
  },

  register: (req, res) => {
    res.render("auth/register");
  },

  registerSubmit: (req, res) => {
    // implement
  },
};

module.exports = authController;
