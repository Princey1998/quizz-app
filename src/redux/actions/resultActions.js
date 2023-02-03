import { createAction } from '@reduxjs/toolkit'

export const getResultsLoading = createAction('quiz/getResults/loading')
export const getResultsSuccess = createAction('quiz/getResults/success')
export const getResultsError = createAction('quiz/getResults/error')
