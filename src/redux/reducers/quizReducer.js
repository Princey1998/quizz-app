import * as quizActions from "../actions/quizActions";
import * as commonActions from "../actions/commonActions";
import { createReducer, createEntityAdapter } from "@reduxjs/toolkit";

const myQuizAdapter = createEntityAdapter({
  selectId: (quiz) => quiz.id,
});

const initialState = {
  myQuiz: myQuizAdapter.getInitialState(),
  updateMyQuizByIdLoading: new Set(),
  deleteMyQuizByIdLoading: new Set(),
  lastMyQuizUpdatedOn: new Date(0),
};

const quizReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(quizActions.createNewQuizLoading, (state, action) => {
      state.createNewQuizLoading = true;
    })
    .addCase(quizActions.createNewQuizSuccess, (state, action) => {
      state.createNewQuizLoading = false;
      state.newQuiz = action.payload;
    })
    .addCase(quizActions.createNewQuizError, (state, action) => {
      state.createNewQuizLoading = false;
      state.createNewQuizError = action.payload;
    })
    .addCase(quizActions.createNewQuizReset, (state, action) => {
      state.createNewQuizLoading = false;
      state.newQuiz = null;
      state.createNewQuizError = null;
    })

    .addCase(quizActions.getMyQuizLoading, (state, action) => {
      state.getMyQuizLoading = true;
    })
    .addCase(quizActions.getMyQuizSuccess, (state, action) => {
      state.getMyQuizLoading = false;
      myQuizAdapter.upsertMany(state.myQuiz, action.payload.quizList);
      state.lastMyQuizUpdatedOn = action.payload.lastUpdatedOn;
    })
    .addCase(quizActions.getMyQuizError, (state, action) => {
      state.getMyQuizLoading = false;
      state.getMyQuizError = action.payload;
    })

    .addCase(quizActions.getQuizLoading, (state, action) => {
      state.getQuizLoading = true;
    })
    .addCase(quizActions.getQuizSuccess, (state, action) => {
      state.getQuizLoading = false;
      state.quiz = action.payload;
    })
    .addCase(quizActions.getQuizError, (state, action) => {
      state.getQuizLoading = false;
      state.getQuizError = action.payload;
    })

    .addCase(quizActions.getQuizByIdLoading, (state, action) => {
      state.getQuizByIdLoading = true;
    })
    .addCase(quizActions.getQuizByIdSuccess, (state, action) => {
      state.getQuizByIdLoading = false;
      state.quizById = {
        quiz: action.payload.quiz,
        quizQuestions: action.payload.quizQuestions,
      };
    })
    .addCase(quizActions.getQuizByIdError, (state, action) => {
      state.getQuizByIdLoading = false;
      state.getQuizByIdError = action.payload;
    })

    .addCase(quizActions.updateMyQuizByIdLoading, (state, action) => {
      state.updateMyQuizByIdLoading.add(action.payload);
    })
    .addCase(quizActions.updateMyQuizByIdSuccess, (state, action) => {
      state.updateMyQuizByIdLoading.delete(action.payload.id);
      myQuizAdapter.updateOne(state.myQuiz, {
        id: action.payload.id,
        changes: action.payload.myQuiz,
      });
      if (action.payload.quizById) {
        state.quizById = action.payload.quizById;
      }
    })
    .addCase(quizActions.updateMyQuizByIdError, (state, action) => {
      state.updateMyQuizByIdLoading.delete(action.payload.id);
      state.updateMyQuizByIdError = action.payload.error;
    })

    .addCase(quizActions.deleteMyQuizByIdLoading, (state, action) => {
      state.deleteMyQuizByIdLoading.add(action.payload);
    })
    .addCase(quizActions.deleteMyQuizByIdSuccess, (state, action) => {
      state.deleteMyQuizByIdLoading.delete(action.payload.id);
      myQuizAdapter.removeOne(state.myQuiz, action.payload.id);
    })
    .addCase(quizActions.deleteMyQuizByIdError, (state, action) => {
      state.deleteMyQuizByIdLoading.delete(action.payload.id);
      state.deleteMyQuizByIdError = action.payload.error;
    })

    .addCase(commonActions.clearRedux, (state, action) => {
      return initialState;
    });
});

export default quizReducer;
