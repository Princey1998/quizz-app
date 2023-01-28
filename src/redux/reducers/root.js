import { combineReducers } from "@reduxjs/toolkit";
import counterReducer from "./counter";

export const rootReducers = combineReducers(
    {
        counterReducer
    }
)