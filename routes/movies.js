var express = require('express');
var router = express.Router();
const movieRepo = require('../src/movierepo');

/* GET all movie listing */
router.get('/', async (req, res, next) => {
  const allMovieData = await movieRepo.findAll();
  res.render('movies',{ movies : allMovieData });
});

/* GET Create movie Page */
router.get('/new', (req, res, next) => {
  res.render('new',{title: 'Create a New Movie', buttonText: 'Create Movie', actionURL: 'new'});
});

/* POST movie Details from Create Movies Page */
router.post('/new', (req, res, next) => {
  const { title, director, year, notes } = req.body;
  const movie = { title: title, director: director, year: year, notes: notes};
  movieRepo.createNewMovie(movie);
  res.redirect('/movies');
});

/* GET Single Movie View Page */
router.get('/:id', async (req, res, next) => {
  const singleMovieData = await movieRepo.findById(req.params.id);
  console.log("id: "+ singleMovieData);
  if(singleMovieData){
  res.render('show', { movie: singleMovieData});
  } else {
    res.redirect('/movies');
  }
});

module.exports = router;