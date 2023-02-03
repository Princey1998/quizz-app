import * as resultActions from "../actions/resultActions";
import * as commonActions from "../actions/commonActions";
import { createReducer } from "@reduxjs/toolkit";


const initialState = {
  results: [],
  lastResultCreatedOn: new Date(0)
};

const resultReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(resultActions.getResultsLoading, (state, action) => {
      state.getResultsLoading = true;
    })
    .addCase(resultActions.getResultsSuccess, (state, action) => {
      state.getResultsLoading = false;
      state.results = action.payload.results
      state.lastResultCreatedOn = action.payload.lastCreatedOn
    })
    .addCase(resultActions.getResultsError, (state, action) => {
      state.getResultsLoading = false;
      state.getResultsError = action.payload;
    })
    
    .addCase(commonActions.clearRedux, (state, action) => {
      return initialState;
    });
});

export default resultReducer;