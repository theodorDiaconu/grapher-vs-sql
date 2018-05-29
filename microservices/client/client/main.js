import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

Meteor.startup(() => {
  ReactDOM.render(<App />, document.getElementById('app'));
});
