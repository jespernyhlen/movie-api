const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const port = 1448;

require('dotenv').config();

const HOST = process.env.DB_HOST;
const PASSWORD = process.env.DB_PASSWORD;

mongoose.connect(
    `mongodb+srv://${HOST}:${PASSWORD}@rest-vdyua.mongodb.net/test?retryWrites=true&w=majority`
);

const Movie = require('./movieModel');

// let id = 14323;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.options('*', cors());

app.use('', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Methods',
        'PUT, GET, POST, DELETE, OPTIONS'
    );
    res.header('Access-Control-Allow-Headers', '*');
    //Auth Each API Request created by user.
    next();
});

app.get('/movies', (req, res, next) => {
    const id = req.query.id;
    const vote_min = parseInt(req.query.vote_min) || 0;
    const vote_max = parseInt(req.query.vote_max) || 10;
    const per_page = parseInt(req.query.per_page) || 10;
    const page = parseInt(req.query.page) || 1;
    const year_min = req.query.year_min || 1980;
    const year_max = req.query.year_max || 2030;
    const genre = parseInt(req.query.genre) || '';
    const search = req.query.search || '';
    console.log(search);

    if (req.query.genre) {
        Movie.find({
            genres: {
                $elemMatch: { id: genre }
            },
            original_title: { $regex: search, $options: 'i' },
            vote_average: { $gte: vote_min, $lte: vote_max },
            release_date: { $gte: year_min, $lte: year_max }
        })
            .sort({ release_date: -1 })
            .skip(per_page * page - per_page)
            .limit(per_page)
            .exec(function(err, data) {
                if (data != null) {
                    Movie.find({
                        genres: {
                            $elemMatch: { id: genre }
                        },
                        original_title: { $regex: search, $options: 'i' },
                        vote_average: { $gte: vote_min, $lte: vote_max },
                        release_date: { $gte: year_min, $lte: year_max }
                    })
                        .count()
                        .exec(function(err, count) {
                            if (count != null) {
                                res.status(200).json({
                                    success: true,
                                    data: data,
                                    currentpage: page,
                                    totalpages: Math.ceil(count / per_page)
                                });
                            } else {
                                console.log('Milestone Error: ', err);
                                res.status(500).json({
                                    success: false,
                                    error:
                                        'Internal Server Error. Please try again.'
                                });
                            }
                        });
                }
            });
    } else if (req.query.vote_min || req.query.year_min || req.query.search) {
        Movie.find({
            original_title: { $regex: search, $options: 'i' },
            vote_average: { $gte: vote_min, $lte: vote_max },
            release_date: { $gte: year_min, $lte: year_max }
        })
            .sort({ release_date: -1 })
            .skip(per_page * page - per_page)
            .limit(per_page)
            .exec(function(err, data) {
                if (data != null) {
                    Movie.find({
                        original_title: { $regex: search, $options: 'i' },
                        vote_average: { $gte: vote_min, $lte: vote_max },
                        release_date: { $gte: year_min, $lte: year_max }
                    })
                        .count()
                        .exec(function(err, count) {
                            if (count != null) {
                                res.status(200).json({
                                    success: true,
                                    data: data,
                                    currentpage: page,
                                    totalpages: Math.ceil(count / per_page)
                                });
                            } else {
                                console.log('Milestone Error: ', err);
                                res.status(500).json({
                                    success: false,
                                    error:
                                        'Internal Server Error. Please try again.'
                                });
                            }
                        });
                }
            });
    } else if (req.query.latest) {
        Movie.find()
            .sort({ release_date: -1 })
            .skip(per_page * page - per_page)
            .limit(per_page)
            .exec(function(err, data) {
                if (data != null) {
                    Movie.find({})
                        .count()
                        .exec(function(err, count) {
                            if (count != null) {
                                res.status(200).json({
                                    success: true,
                                    data: data,
                                    currentpage: page,
                                    totalpages: 20
                                });
                            } else {
                                console.log('Milestone Error: ', err);
                                res.status(500).json({
                                    success: false,
                                    error:
                                        'Internal Server Error. Please try again.'
                                });
                            }
                        });
                }
            });
    } else if (req.query.id) {
        Movie.findById(id).exec(function(err, data) {
            if (data != null) {
                res.status(200).json({
                    success: true,
                    data: data
                });
            } else {
                console.log('Milestone Error: ', err);
                res.status(500).json({
                    success: false,
                    error: 'Internal Server Error. Please try again.'
                });
            }
        });
    }
});

app.get('/movies/all', (req, res, next) => {
    Movie.find()
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
