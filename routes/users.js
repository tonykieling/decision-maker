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

//we wont need this file (I think).
// It just show the admin doing a search.
// It will be usefull this knex structure for being used in other situations
