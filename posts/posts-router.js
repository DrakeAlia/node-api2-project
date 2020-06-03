const express = require('express');

const Posts = require('../data/db.js'); // <fix the folder path></fix>

const router = express.Router();

// * Creates a post using the information sent inside the request body.
router.post('/', (req, res) => {
	const addData = req.body;

	// if the request body is missing the title or contents property:
	if (!addData.title || !addData.contents) {
		// cancel the request.
		// respond with HTTP status code `400` (Bad Request).
		// return the following JSON response
		res.status(400).json({ errorMessage: 'Please provide title and contents for the post.' });
		// if the information about the post is valid:
	} else {
		// return HTTP status code `201` (Created).
        // return the newly created _post_.
		Posts.insert(addData)
			.then((postRes) => {
				res.status(201).json(postRes);
			})
			// if there's an error while saving the _post_:
			// respond with HTTP status code `500` (Server Error).
			.catch((error) => {
				console.log(error);
				res.status(500).json({ error: 'There was an error while saving the post to the database' });
			});
	}
});

// * When the client makes a POST request
// Creates a comment for the post
router.post('/:id/comments', (req, res) => {
	const { id } = Number(req.params);
	const comments = { ...req.body, post_id: id };
	if (!comments.text) {
		res.status(400).json({ errorMessage: 'Please provide text for the comment.' });
	} else {
		Posts.findById(id).then((post) => {
            // if the post with the specified id is not found:
            // if that array is empty, no id exist
			if (post.length === 0) {
				res.status(404).json({ message: 'The post with the specified ID does not exist.' });
				// if the information about the comment is valid:
			} else {
				Posts.insertComment(comments)
					.then((res) => {
						res.status(201).json(res);
					})
					.catch((error) => {
						console.log(error);
						// if there's an error while saving the comment:
						res.status(500).json({ error: 'There was an error while saving the comment to the database' });
					});
			}
		});
	}
});

// * When the client makes a GET request
// Returns an array of all the post objects
router.get('/', (req, res) => {
	Posts.find(req.query)
		.then((postData) => {
			res.status(200).json(postData);
		})
		.catch((error) => {
			// log error to database
			console.log(error);
			// if there's an error in retrieving the posts from the database:
			res.status(500).json({ error: 'The posts information could not be retrieved.' });
		});
});

// * When the client makes a GET request
router.get('/:id', (req, res) => {
	Posts.findById(req.params.id)
		.then((post) => {
			if (post.length === 0) {
                // if the post with the specified id is not found:
                res.status(404).json({ message: 'The post with the specified ID does not exist.' });
			} else {
				res.status(200).json(post);
			}
		})
		.catch((error) => {
			// log error to database
			console.log(error);
			// if there's an error in retrieving the post from the database:
			res.status(500).json({ error: 'The post information could not be retrieved.' });
		});
});

// * When the client makes a GET request
router.get('/:id/comments', (req, res) => {
        Posts.findById(req.params.id)
          .then(post => {
            if(post.length === 0){
              res.status(404).json({ message: "The post with the specified ID does not exist." })
            } else {
              console.log(post)
              Posts.findPostComments(req.params.id)
              .then(comments => res.status(200).json(comments))
              .catch(err => {
                console.log(err)
                res.status(500).json({ error: "The comments information could not be retrieved." })
              })
            }
          })
      })


// * When the client makes a DELETE request
router.delete('/:id', (req, res) => {
	Posts.remove(req.params.id)
		.then((post) => {
			// If the post with the specified id is not found:
			if (!post) {
				res.status(404).json({ message: 'The post with the specified ID does not exist.' });
			} else {
				res.status(200).json(`post ${req.params.id} has been delete`);
			}
		})
		.catch((error) => {
			// log error to database
			console.log(error);
			// If there's an error in removing the post from the database:
			res.status(500).json({ error: 'The post could not be removed' });
		});
});

// * When the client makes a PUT request
router.put('/:id', (req, res) => {
	Posts.update(req.params.id, req.body)
		.then((posts) => {
            // If the _post_ with the specified `id` is not found:
            // return HTTP status code `404` (Not Found).
			if (posts === undefined) {
				res.status(404).json({ message: 'The post with the specified ID does not exist.' });
			} else if (!req.body.title || !req.body.contents) {
				res.status(400).json({ errorMessage: 'Please provide title and contents for the post.' });
			} else {
				res.status(200).json(`post ${req.params.id} has been updated`);
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: 'The post information could not be modified.' });
		});
});

module.exports = router;
