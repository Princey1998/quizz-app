import { createAction } from '@reduxjs/toolkit'

export const loginLoading = createAction('auth/login/loading')
export const loginSuccess = createAction('auth/login/success')
export const loginError = createAction('auth/login/error')
export const signupLoading = createAction('auth/signup/loading')
export const signupSuccess = createAction('auth/signup/success')
export const signupError = createAction('auth/signup/error')
export const validateUserLoading = createAction('auth/validateUser/loading')
export const validateUserSuccess = createAction('auth/validateUser/success')
export const validateUserError = createAction('auth/validateUser/error')
export const signOut = createAction('auth/signOut')