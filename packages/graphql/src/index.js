const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/sample');

const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  }),
);

module.exports = app;
