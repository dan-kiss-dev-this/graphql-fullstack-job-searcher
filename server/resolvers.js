const db = require('./db');

// root is the query type aka parent, args is the real arguments you need
const Query = {
  // job: (root, args) => db.jobs.get(args.id),
  job: (queryTypeakaRoot, { id }) => db.jobs.get(id),
  jobs: () => db.jobs.list()
}

const Job = {
  company: (job) => db.companies.get(job.companyId)
}

module.exports = {
  Query,
  Job
}