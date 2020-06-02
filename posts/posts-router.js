const router = require('express');

const Posts = require('../data/db.js');

router.post("/", (req, res) => {
    Posts.add(req.body)
    .then(posts => {
        res.status(201).json(posts);
    })
    .catch(error => {
        console.log(error)
        res.
    })
}