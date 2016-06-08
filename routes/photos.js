const express = require('express')
const router = express.Router()

const {MatchEngine} = require('tineye-matchengine')
const matchEngine = new MatchEngine(
  process.env.TINEYE_USERNAME,
  process.env.TINEYE_PASSWORD,
  process.env.TINEYE_BASE_URL
)

const TinEyeAddQueue = require('../lib/tineye_add_queue.js')
const queue = new TinEyeAddQueue(matchEngine)

router.get('/', function(req, res) {
  res.send('~(=^‥^)_旦~ < tineye tea time?')
})

router.get('/alive', function(req, res) {
  res.send('alive')
})

/* Add a photo to the TinEye index */
router.post('/add', function(req, res) {
  const data = {
    url: req.body.url,
    filepath: req.body.filepath,
    queued: Date.now(),
    processed: null,
    response: {}
  }
  const job = queue.add(data)
  job.on('complete', function(result) {
    res.send(result)
  })
})

/* Get the number of items currently in the collection */
router.get('/count', function(req, res) {
  matchEngine.count(function(err, data) {
    const response = data || err
    res.send(response)
  })
})

/* Compare two images and return the match score (if any) */
router.post('/compare', function(req, res) {
  matchEngine.compare({url1: req.body.url1, url2: req.body.url2}, function(err, data) {
    const response = data || err
    res.send(response)
  })
})

/* Delete an image from the TinEye index */
router.delete('/delete', function(req, res) {
  matchEngine.delete({filepath: req.body.filepath}, function(err, data) {
    const response = data || err
    res.send(response)
  })
})

/* Check whether the MatchEngine search server is running */
router.get('/ping', function(req, res) {
  matchEngine.ping(function(err, data) {
    const response = data || err
    res.send(response)
  })
})

/* Search the TinEye index for an image */
router.post('/search', function(req, res) {
  matchEngine.search({image_url: req.body.image_url}, function(err, data) {
    const response = data || err
    res.send(response)
  })
})

module.exports = router
