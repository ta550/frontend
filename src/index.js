import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

// React Redux
import allReducers from './reducers/index'
import {createStore} from 'redux'
import { Provider } from 'react-redux'
import StateLoader  from './reducers/PresistedState'
const stateLoader = new StateLoader();

let store = createStore(allReducers, stateLoader.loadState(), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

store.subscribe(() => {
    stateLoader.saveState(store.getState());
});

ReactDOM.render(
    <Provider store={store}>
    <App />
    </Provider>
    ,document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
