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

class TinEyeAddQueue {
  constructor() {
    this.queue = queue
    this.queue.process('add_photo', function(job, done) {
      matchEngine.add({url: job.data.url, filepath: job.data.filepath}, function(err, data) {
        job.data.processed = Date.now()
        job.data.response = data
        done(null, job.data)
      })
    })

    this.queue.on('job complete', function(id) {
      kue.Job.get(id, function(err, job){
        if (err) return
        job.remove(function(err){
          if (err) throw err
        })
      })
    })
  }

  add(data) {
    const job = queue.create('add_photo', data)
      .save(function(err) {
        if (err) console.log(err)
      })

    return job
  }
}

module.exports = new TinEyeAddQueue
