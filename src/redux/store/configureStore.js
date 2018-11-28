import {createStore, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
// import composeWithDevTools from 'redux-devtools-extension';

import reducer from '../reducers'

const composeEnhancers = process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;

export default createStore(
    reducer, 
    composeEnhancers(
        applyMiddleware(thunk),
        // process.env.NODE_ENV === 'development' && window.devToolsExtension ? window.devToolsExtension() : f => f,
    )
);
//process.env.NODE_ENV === 'development' && 
