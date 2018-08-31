import {createStore, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import reducer from '../reducers'

export default createStore(
    reducer, 
    compose(
        applyMiddleware(thunk),
        process.env.NODE_ENV === 'development' && window.devToolsExtension ? window.devToolsExtension() : f => f,
    )
);
//process.env.NODE_ENV === 'development' && 
