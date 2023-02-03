import * as authActions from '../actions/authActions'
import * as commonActions from '../actions/commonActions'
import { createReducer } from '@reduxjs/toolkit'


const initialState = { user: null, validateUserLoading: true }

const authReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(authActions.loginLoading, (state, action) => {
      state.loginLoading = true
    })
    .addCase(authActions.loginSuccess, (state, action) => {
      state.loginLoading = false
    })
    .addCase(authActions.loginError, (state, action) => {
      state.loginLoading = false
      state.loginError = action.payload
    })
    .addCase(authActions.signupLoading, (state, action) => {
      state.signupLoading = true
    })
    .addCase(authActions.signupSuccess, (state, action) => {
      state.signupLoading = false
    })
    .addCase(authActions.signupError, (state, action) => {
      state.signupLoading = false
      state.signupError = action.payload
    })
    .addCase(authActions.validateUserLoading, (state, action) => {
      state.validateUserLoading = true
    })
    .addCase(authActions.validateUserSuccess, (state, action) => {
      state.validateUserLoading = false
      state.user = action.payload
    })
    .addCase(authActions.validateUserError, (state, action) => {
      state.validateUserLoading = false
      state.validateUserError = action.payload
    })
    .addCase(authActions.signOut, (state, action) => {
      state.signOutError = action.payload
    })
    .addCase(commonActions.clearRedux, (state, action) => {
      return initialState
    })
})

export default authReducer