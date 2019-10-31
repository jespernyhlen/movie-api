const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
    _id: Number,
    original_title: String,
    release_date: String,
    vote_average: Number,
    vote_count: Number,
    imdb_id: String,
    backdrop_path: String,
    status: String,
    genres: [],
    popularity: Number,
    original_language: String,
    overview: String,
    poster_path: String,
    runtime: Number
});

module.exports = mongoose.model('Movie', movieSchema);
