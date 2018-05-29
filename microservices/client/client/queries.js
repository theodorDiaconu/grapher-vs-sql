import gql from 'graphql-tag';

export const query1 = gql`
  query {
    posts {
      tags {
        name
      }
      category {
        name
      }
      comments {
        text
        user {
          email
        }
      }
    }
  }
`;

export const query2 = gql`
  query {
    posts {
      title
      tags {
        name
      }
      category {
        name
      }
      user {
        email
      }
    }
  }
`;

export const query3 = gql`
  query {
    posts {
      title
      tags {
        name
      }
      category {
        name
      }
      comments {
        user {
          email
          groups {
            name
          }
        }
      }
    }
  }
`;

export const query4 = gql`
  query {
    groups {
      name
      users {
        email
      }
    }
  }
`;

export const query5 = gql`
  query {
    tags {
      name
      posts {
        title
        category {
          name
        }
      }
    }
  }
`;

export default [query1, query2, query3, query4, query5];
