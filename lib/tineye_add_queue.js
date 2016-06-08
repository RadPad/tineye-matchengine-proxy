class TinEyeAddQueue {
  constructor(matchEngine) {
    const kue = require('kue')
    const REDIS_HOST = process.env.REDIS_HOST || 'localhost'
    const REDIS_PORT = process.env.REDIS_PORT || 6379

    this.queueName = 'add_photo'
    this.queue = kue.createQueue({
      prefix: 'photo_add_queue',
      redis: 'redis://' + REDIS_HOST + ':' + REDIS_PORT
    })

    this.queue.process(this.queueName, function(job, done) {
      matchEngine.add({url: job.data.url, filepath: job.data.filepath},
        function(err, data) {
          job.data.processed = Date.now()
          job.data.response = data
          console.log(job.data)
          done(null, data)
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
    const job = this.queue.create(this.queueName, data)
      .save(function(err) {
        if (err) console.log(err)
      })

    return job
  }
}

module.exports = TinEyeAddQueue
