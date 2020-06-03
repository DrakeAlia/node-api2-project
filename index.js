const express = require('express');

const server = express();

server.use(express.json());

const port = 7000;

server.listen(port, () => console.log(`\n == API on port ${port} == \n`));

const postsRouter = require('./posts/posts-router.js');

server.use('/api/posts', postsRouter);