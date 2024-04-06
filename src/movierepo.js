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

}



module.exports = movieRepo;

