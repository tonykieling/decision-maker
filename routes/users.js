"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("admin")
      .then((results) => {
        console.log("### results: ", results);
        res.json(results);
    });
  });

  // console.log("### router: ", router);
  return router;
}
