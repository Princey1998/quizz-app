import { createStore,applyMiddleware } from 'redux';
import { rootReducers } from './reducers/root';
import { composeWithDevTools } from '@redux-devtools/extension';

const composeEnhncer = composeWithDevTools(applyMiddleware())

const store = createStore(rootReducers, composeEnhncer)


export default store


