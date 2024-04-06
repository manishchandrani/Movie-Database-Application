var express = require('express');
var router = express.Router();
const movieRepo = require('../src/movierepo');

/* GET all movie listing */
router.get('/', async (req, res, next) => {
  const allMovieData = await movieRepo.findAll();
  res.render('movies',{ movies : allMovieData });
});

module.exports = router;