import React, { Component } from 'react';
import PropTypes from 'prop-types';
import queries from './queries';

export default class TestRunner extends Component {
  static propTypes = {
    client: PropTypes.object,
    label: PropTypes.string,
    queryRuns: PropTypes.number,
    onComplete: PropTypes.func,
  };

  state = {
    // [{ number: 1, results: [ms], avg: ms }]
    processedQueries: [],
    loading: true,
  };

  componentDidMount() {
    this.startLoading().then(() => {
      this.setState({
        loading: false,
      });
    });
  }

  async startLoading() {
    const { client, queryRuns, onComplete } = this.props;
    let processedQueries;

    for (j = 0; j < queries.length; j++) {
      const query = queries[j];
      let data;

      const processedQuery = {
        number: j + 1,
        results: [],
        avg: null,
      };

      let totalElapsedMs = 0;
      let minimumElapsedMs = 10000000;
      let maximumElapsedMs = 0;

      // Now running the query multiple times and aggregating the result
      for (let i = 0; i < queryRuns; i++) {
        const start = new Date();

        data = await client.query({ query, fetchPolicy: 'no-cache' });
        const end = new Date();

        const elapsedMs = end - start;
        processedQuery.results.push(elapsedMs);
        totalElapsedMs += elapsedMs;

        elapsedMs < minimumElapsedMs && (minimumElapsedMs = elapsedMs);
        elapsedMs > maximumElapsedMs && (maximumElapsedMs = elapsedMs);
      }

      processedQuery.avg = totalElapsedMs / queryRuns;
      processedQuery.min = minimumElapsedMs;
      processedQuery.max = maximumElapsedMs;

      processedQueries = [...this.state.processedQueries, processedQuery];
      this.setState({
        processedQueries,
      });

      console.log(`Completed Query ${j + 1}`, data);
    }

    onComplete && onComplete(processedQueries);
  }

  render() {
    const { processedQueries, loading } = this.state;
    const { label } = this.props;

    return (
      <div>
        <h1>Query Results ({label})</h1>
        <h2>
          {loading
            ? 'Please wait, tests are running ...'
            : 'Check the results!'}
        </h2>

        {processedQueries.map(processedQuery => {
          return (
            <ProcessedQueryResult
              key={processedQuery.number}
              {...processedQuery}
            />
          );
        })}
      </div>
    );
  }
}

const ProcessedQueryResult = ({ number, results, avg, min, max }) => {
  return (
    <ul>
      <li>Query: {number}</li>
      {/* <li>Results: {results.map(r => `${r}ms`).join(', ')}</li> */}
      <li>Average: {`${avg}ms`}</li>
      <li>Smallest: {`${min}ms`}</li>
      <li>Largest: {`${max}ms`}</li>
      <li>
        <hr />
      </li>
    </ul>
  );
};
