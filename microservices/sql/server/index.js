import { Schema } from '/imports/entities/graphql-objects';
import '/imports/entities/fixtures';

import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';

const myGraphQLSchema = Schema; // ... define or import your schema here!
const PORT = 3000;

const app = express();

app.use('/graphql', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Content-Length, X-Requested-With'
  );
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress({
    schema: myGraphQLSchema,
  })
);
app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

WebApp.connectHandlers.use(app);
