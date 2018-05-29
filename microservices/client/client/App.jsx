import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TestRunner from './TestRunner';
import { grapherClient, sqlClient } from './graphql';

const QUERY_RUNS = 50;

export default class App extends Component {
  state = {};

  results = {
    grapher: null,
    sql: null,
  };

  onComplete = (results, ctx, state) => {
    this.results[ctx] = results;
    this.setState(state);
  };

  render() {
    const { next, showResults } = this.state;

    return (
      <div>
        <h1>Welcome to Query Performance Testing</h1>
        <hr />
        <TestRunner
          client={grapherClient}
          label="Grapher Test"
          queryRuns={QUERY_RUNS}
          onComplete={r => this.onComplete(r, 'sql', { next: true })}
        />

        {next && (
          <TestRunner
            client={sqlClient}
            label="SQL Test"
            queryRuns={QUERY_RUNS}
            onComplete={r =>
              this.onComplete(r, 'grapher', { showResults: true })
            }
          />
        )}
      </div>
    );
  }
}
