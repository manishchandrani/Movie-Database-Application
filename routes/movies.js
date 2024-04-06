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

/* GET Edit movie Page */
router.get('/:id/edit', async (req, res, next) => {
  const movieData = await movieRepo.findById(req.params.id);
  res.render('edit', { movie: movieData, title: 'Edit Movie', buttonText: 'Edit movie', actionURL: 'edit' });
});

/* POST Updated movie Details from Edit Movies Page */
router.post('/:id/edit', async (req, res, next) => {
  const { title, director, year, notes } = req.body;
  const movieId = req.params.id;
  const updatedMovie = { title, director, year, notes };
  await movieRepo.updateMovie(movieId, updatedMovie);
  res.redirect('/movies/' + movieId);
});


module.exports = router;