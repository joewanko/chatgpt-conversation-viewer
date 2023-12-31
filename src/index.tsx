import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// @ts-expect-error
import GitHubForkRibbon from 'react-github-fork-ribbon';
import { REPO_URL } from './constants';

const el = document.getElementById('root');

const root = el && ReactDOM.createRoot(el);
root?.render(
  <React.StrictMode>
    <App />
    <GitHubForkRibbon
          href={REPO_URL}
          target="_blank"
          position="right">
          Fork me on GitHub
        </GitHubForkRibbon>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
