# GraphQL Job Board

$npm start in client and server folders to run project, to see graphql playground go to http://localhost:9000/graphql to see front end go to http://localhost:3000/.

To add a new job in the GraphQL playground use

mutation CreateJob($input: CreateJobInput){
  job: createJob(input: $input) {
    id
    title
    company {
      id
      name
    }
  }
}

query variable

{
  "input": {
    "title": "New Job12",
    "description": "describe Job12"
  }
}

http header-note the number after Bearer comes from checking your local storage from the token you get from logging into the front end

{
  "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJCSnJwLUR1ZEciLCJpYXQiOjE1OTU0NTMxNjZ9.7GoKXhH7LzTmSiH6MUgedOuL_s5Vs9UfvzZlO9bNuDI"
}


