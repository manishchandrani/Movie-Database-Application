const { MongoClient, ObjectId } = require('mongodb');
const Movie = require("./movie");

const url = process.env.MONGODB_URL;
const client = new MongoClient(url);

async function connect() {
  try {
    await client.connect();
    console.log("Successfully Connected to MongoDB Server");
  } catch (err) {
    console.error("Connection unsuccessful", err);
  }
}

connect();

const movieRepo = {
  /* Find all the available movies */
  findAll: async () => {
    let moviesList = [];
    const moviesCollection = client.db('movie_database').collection('movies');
    const moviesDataFromDB = moviesCollection.find({});
    for await (const data of moviesDataFromDB) {
      const movieObj = new Movie(data._id.toString(), data.title, data.director, data.year, data.notes);
      moviesList.push(movieObj);
    }
    return moviesList;

  },

  /* find a movie by id */
  findById: async (id) => {
    const moviesCollection = client.db('movie_database').collection('movies');
    const filter = { _id: new ObjectId(id) };
    const result = await moviesCollection.findOne(filter);
    return new Movie(result._id.toString(), result.title, result.director, result.year, result.notes);
  },
  /* Creating a new movie into the database */
  createNewMovie: async (movieData) => {
    const newMovie = { title: movieData.title, director: movieData.director, year: movieData.year, notes: movieData.notes };
    const moviesCollection = client.db('movie_database').collection('movies');
    const result = await moviesCollection.insertOne(newMovie);
  },

}



module.exports = movieRepo;

