const auth = require('basicauth-middleware')
const basicAuth = auth(process.env.HTTP_USERNAME, process.env.HTTP_PASSWORD)
const express = require('express')
const queue = require('../lib/matchengine_queue.js')
const router = express.Router()

router.get('/', function(req, res) {
  res.send('~(=^‥^)_旦~ < tineye tea time?')
})

router.get('/alive', function(req, res) {
  res.send('alive')
})

/* Add a photo to the TinEye index */
router.post('/add', basicAuth, function(req, res) {
  queue.add(req.body.url, req.body.filepath)
    .on('complete', function(result) {
      res.send(result)
    })
})

/* Get the number of items currently in the collection */
router.get('/count', function(req, res) {
  queue.count(function(err, data) {
    const response = data || err
    res.send(response)
  })
})

/* Compare two images and return the match score (if any) */
router.post('/compare', basicAuth, function(req, res) {
  queue.compare({url1: req.body.url1, url2: req.body.url2}, function(err, data) {
    const response = data || err
    res.send(response)
  })
})

/* Delete an image from the TinEye index */
router.delete('/delete', basicAuth, function(req, res) {
  queue.delete(req.query.filepath)
    .on('complete', function(result) {
      res.send(result)
    })
})

/* Check whether the MatchEngine search server is running */
router.get('/ping', function(req, res) {
  queue.ping(function(err, data) {
    const response = data || err
    res.send(response)
  })
})

/* Search the TinEye index for an image */
router.post('/search', basicAuth, function(req, res) {
  queue.search({image_url: req.body.url}, function(err, data) {
    const response = data || err
    res.send(response)
  })
})

module.exports = router
