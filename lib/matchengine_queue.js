const {MatchEngine} = require('tineye-matchengine')
const matchEngine = new MatchEngine(
  process.env.TINEYE_USERNAME,
  process.env.TINEYE_PASSWORD,
  process.env.TINEYE_BASE_URL
)

class MatchEngineQueue {
  constructor() {
    const kue = require('kue')
    const REDIS_HOST = process.env.REDIS_HOST || 'localhost'
    const REDIS_PORT = process.env.REDIS_PORT || 6379

    this.addQueue = 'add'
    this.deleteQueue = 'delete'
    this.queue = kue.createQueue({
      prefix: 'matchengine',
      redis: 'redis://' + REDIS_HOST + ':' + REDIS_PORT
    })

    this.queue.process(this.addQueue, function(job, done) {
      matchEngine.add({url: job.data.url, filepath: job.data.filepath},
        function(err, data) {
          job.data.id = job.id
          job.data.processed = Date.now()
          job.data.response = data
          console.log(job.data)
          done(null, data)
        })
    })

    this.queue.process(this.deleteQueue, function(job, done) {
      matchEngine.delete({filepath: job.data.filepath},
        function(err, data) {
          job.data.id = job.id
          job.data.processed = Date.now()
          job.data.response = data
          console.log(job.data)
          done(null, data)
        })
    })
  }

  add(data) {
    const job = this.queue.create(this.addQueue, data)
      .removeOnComplete(true)
      .save(function(err) {
        if (err) console.log(err)
      })

    return job
  }

  compare(data, done) {
    matchEngine.compare(data, done)
  }

  count(done) {
    matchEngine.count(done)
  }

  delete(data) {
    const job = this.queue.create(this.deleteQueue, data)
      .removeOnComplete(true)
      .save(function(err) {
        if (err) console.log(err)
      })

    return job
  }

  ping(done) {
    matchEngine.ping(done)
  }

  search(data, done) {
    matchEngine.search(data, done)
  }
}

module.exports = new MatchEngineQueue()
