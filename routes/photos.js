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

/* ADD a photo to TinEye */
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

/* Delete an image from the TinEye index */
router.post('/delete', function(req, res) {
  matchEngine.delete({filepath: req.body.filepath}, function(err, data) {
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
