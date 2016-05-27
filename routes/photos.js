const express = require('express')
const router = express.Router()
const kue = require('kue')
const queue = kue.createQueue({
  prefix: 'photo_add_queue',
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST
  }
})

queue.on('job complete', function(id) {
  kue.Job.get(id, function(err, job){
    if (err) return
    job.remove(function(err){
      if (err) throw err
      //console.log('removed completed job #%d', job.id)
    })
  })
})

queue.process('add_photo', function(job, done) {
  add_photo(job.data, done)
})

function add_photo(job_data, done) {
  // TODO: Actual TinEye API integration
  job_data.processed = Date.now()
  done(null, JSON.stringify(job_data))
}

/* ADD a photo to TinEye */
router.post('/add', function(req, res) {
  const image = req.body.image
  const image_url = image.url
  const image_path = image.path

  const job = queue.create('add_photo', {
    image_url: image_url,
    image_path: image_path,
    queued: Date.now(),
    processed: null
  }).save(function(err) {
    if (err) console.log(err)
  })

  job.on('complete', function(result) {
    console.log(result)
    res.send(result)
  })
})

module.exports = router
