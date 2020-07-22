const db = require('./db');

// root is the query type aka parent, args is the real arguments you need
const Query = {
  company: (root, { id }) => db.companies.get(id),
  // job: (root, args) => db.jobs.get(args.id),
  job: (queryTypeakaRoot, { id }) => db.jobs.get(id),
  jobs: () => db.jobs.list()
}

const Mutation = {
  createJob: (parentRoot, { input }) => {
    // createJob: (parentRoot, graphQLObjectWithArguments) => {
    // we pass input in plain below as input is already an object
    const id = db.jobs.create(input);
    // creating a job returns the id then we use the id to get the job
    console.log(17, db.jobs.get(id));
    return db.jobs.get(id);
  }
}

const Company = {
  jobs: (company) => db.jobs.list()
    .filter((job) => job.companyId === company.id)
}

const Job = {
  company: (job) => db.companies.get(job.companyId)
}

module.exports = {
  Query,
  Job,
  Company,
  Mutation
}