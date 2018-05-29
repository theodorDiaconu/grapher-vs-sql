import ApolloClient from 'apollo-boost';

const GRAPHER_GRAPHQL_ENDPOINT = 'http://localhost:5040/graphql';
const SQL_GRAPHQL_ENDPOINT = 'http://localhost:5050/graphql';

export const grapherClient = new ApolloClient({
  uri: GRAPHER_GRAPHQL_ENDPOINT,
});

export const sqlClient = new ApolloClient({
  uri: SQL_GRAPHQL_ENDPOINT,
});
