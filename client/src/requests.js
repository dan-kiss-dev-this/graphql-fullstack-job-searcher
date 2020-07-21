// used for graphql requests

const endpointURL = 'http://localhost:9000/graphql'

export async function graphqlRequest(query, variables = {}) {
  const response = await fetch(endpointURL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      query: query,
      variables: variables
    })
  });
  const responseBody = await response.json();
  if (responseBody.errors) {
    const message = responseBody.errors.map(error=> error.message).join('\n')
    throw new Error(message)
  }
  return responseBody.data;
}

export async function loadJob(id) {
  const query =
    `query JobQuery($id: ID!){
      job(id: $id) {
        id
        title
        company {
          id
          name
        }
        description
      }     
    }`;
  const data = await graphqlRequest(query, { id });
  const job = data.job
  return job;
}

export async function loadJobs() {
  const query = `{
    jobs {
      id
      titlez
      company {
        id
        name
      }
    }
      
  }`;
  const { jobs } = await graphqlRequest(query)
  return jobs;
}