import {createStore, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import reducer from '../reducers'

export default createStore(
    reducer, 
    compose(
        applyMiddleware(thunk),
        window.devToolsExtension && process.env.NODE_ENV === 'development' ? window.devToolsExtension() : f => f,
    )
);
