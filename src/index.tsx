// import 'mobx-react-lite/batchingForReactDom';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import fa from './example/translations/fa';
import en from './example/translations/en';
import {initTranslation} from './lib/translations/i18n';
import ExampleApp from './example/ExampleApp';
// import * as serviceWorker from './serviceWorker';

initTranslation({fa, en});

ReactDOM.render(<ExampleApp />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
