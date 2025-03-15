const mongoose = require('mongoose');
const Movie = require('./Movies'); // Import the Movie model

mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

const movies = [
  {
    title: "Princess Mononoke",
    releaseDate: 1997,
    genre: "Fantasy",
    actors: [
      { actorName: "Yōji Matsuda", characterName: "Ashitaka" },
      { actorName: "Yuriko Ishida", characterName: "San" },
    ]
  },
  {
    title: "Spiderman: Into the Spider-Verse",
    releaseDate: 2018,
    genre: "Action",
    actors: [
      { actorName: "Shameik Moore", characterName: "Miles Morales" },
      { actorName: "Jake Johnson", characterName: "Peter B. Parker" },
    ]
  },
  {
    title: "The Pursuit of Happyness",
    releaseDate: 2006,
    genre: "Drama",
    actors: [
      { actorName: "Will Smith", characterName: "Chris Gardner" },
      { actorName: "Jaden Smith", characterName: "Christopher Jr." },
    ]
  },
  {
    title: "Your Name",
    releaseDate: 2016,
    genre: "Fantasy",
    actors: [
      { actorName: "Ryunosuke Kamiki", characterName: "Taki Tachibana" },
      { actorName: "Mone Kamishiraishi", characterName: "Mitsuha Miyamizu" },
    ]
  },
  {
    title: "The Lion King",
    releaseDate: 1994,
    genre: "Adventure",
    actors: [
      { actorName: "Matthew Broderick", characterName: "Simba" },
      { actorName: "Jeremy Irons", characterName: "Scar" },
    ]
  }
];

const seedMovies = async () => {
  try {
    await Movie.deleteMany(); // Clear existing movies
    await Movie.insertMany(movies);
    console.log('Movies added successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding movies:', error);
    mongoose.connection.close();
  }
};

seedMovies();
