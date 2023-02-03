import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authReducer";
import quizReducer from "./quizReducer";
import resultReducer from "./resultReducer"

export const rootReducers = combineReducers(
    {
       authReducer,
       quizReducer,
       resultReducer
    }
)