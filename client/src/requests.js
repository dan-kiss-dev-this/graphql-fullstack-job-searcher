// used for graphql requests
import { isLoggedIn, getAccessToken } from "./auth";
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from 'apollo-boost'
import gql from 'graphql-tag'

const endpointURL = 'http://localhost:9000/graphql'

const authLink = new ApolloLink((operation, forward) => {
  if (isLoggedIn()) {
    operation.setContext({
      headers: {
        'authorization': 'Bearer ' + getAccessToken()
      }
    });
    //request.headers['authorization'] = 'Bearer ' + getAccessToken();
  }
  return forward(operation);
})

// setup needed to use apolloclient in the application
const client = new ApolloClient({
  link: ApolloLink.from([
    authLink,
    new HttpLink({ uri: endpointURL })
  ]),
  cache: new InMemoryCache()
})

export async function graphqlRequest(query, variables = {}) {
  const request = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      query: query,
      variables: variables
    })
  }
  if (isLoggedIn()) {
    request.headers['authorization'] = 'Bearer ' + getAccessToken();
  }
  const response = await fetch(endpointURL, request);
  const responseBody = await response.json();
  if (responseBody.errors) {
    const message = responseBody.errors.map(error => error.message).join('\n')
    throw new Error(message)
  }
  return responseBody.data;
}

export async function createJob(input) {
  const mutation = gql`mutation CreateJob($input: CreateJobInput){
    job: createJob(input: $input) {
      id
      title
      company {
        id
        name
      }
    }
  }`;
  const { data: { job } } = await client.mutate({ mutation, variables: { input } })
  // old way below
  //const { job } = await graphqlRequest(mutation, { input });
  return job;
}

export async function loadCompany(id) {
  const query = gql`query CompanyQuery($id: ID!) {
    company(id: $id){
      id
      name
      description
      jobs {
        id
        title
      }
    }
  }`;
  const { data: { company } } = await client.query({ query, variables: { id } })
  return company;
}

export async function loadJob(id) {
  const query =
    gql`
      query JobQuery($id: ID!){
        job(id: $id) {
          id
          title
          company {
            id
            name
          }
          description
        }     
      }
    `;
  // job comes from data.job this is nested destructuring
  const { data: { job } } = await client.query({ query, variables: { id } })
  return job
  // version without apollo client below
  // const query =
  //   `query JobQuery($id: ID!){
  //     job(id: $id) {
  //       id
  //       title
  //       company {
  //         id
  //         name
  //       }
  //       description
  //     }     
  //   }`;
  // const data = await graphqlRequest(query, { id });
  // const job = data.job
  // return job;
}

// replace loadJobs using apollo-boost aka client
export async function loadJobs() {
  //gql is a tag function which parses the string into object that graphql expects
  const query = gql`{
    jobs {
      id
      title
      company {
        id
        name
      }
    }
      
  }`;
  const { data } = await client.query({ query, fetchPolicy: "no-cache" })
  const { jobs } = data
  return jobs;
}