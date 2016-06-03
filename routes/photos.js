const express = require('express')
const router = express.Router()
const got = require('got')

const {MatchEngine} = require('tineye-matchengine')
const matchEngine = new MatchEngine(
  process.env.TINEYE_USERNAME,
  process.env.TINEYE_PASSWORD,
  process.env.TINEYE_BASE_URL
)

const kue = require('kue')
const queue = kue.createQueue({
  prefix: 'photo_add_queue',
  redis: {
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST || localhost
  }
})

queue.process('add_photo', function(job, done) {
  matchEngine.add({url: job.data.url, filepath: job.data.filepath}, function(err, data) {
    job.data.processed = Date.now()
    job.data.response = data
    done(null, job.data)
  })
})

queue.on('job complete', function(id) {
  kue.Job.get(id, function(err, job){
    if (err) return
    job.remove(function(err){
      if (err) throw err
    })
  })
})

/* ADD a photo to TinEye */
router.post('/add', function(req, res) {
  const job = queue.create('add_photo', {
    url: req.body.url,
    filepath: req.body.filepath,
    queued: Date.now(),
    processed: null,
    response: {}
  }).save(function(err) {
    if (err) console.log(err)
  })

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
