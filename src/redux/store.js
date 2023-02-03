import { createStore,applyMiddleware } from 'redux';
import { rootReducers } from './reducers/root';
import { composeWithDevTools } from '@redux-devtools/extension';
import thunk from 'redux-thunk';
import { enableMapSet } from "immer"

enableMapSet()

const composeEnhncer = composeWithDevTools(applyMiddleware(thunk))

const store = createStore(rootReducers, composeEnhncer)


export default store


