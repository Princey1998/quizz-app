import { signInWithEmailAndPassword, updateProfile, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase"
import * as authActions from "../actions/authActions";
import * as commonActions from "../actions/commonActions"

export function loginUserByEmailThunk({ email, password }) {
  return async (dispatch) => {
    dispatch(authActions.loginLoading());
    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      dispatch(authActions.loginSuccess());
    } catch (e) {
      dispatch(authActions.loginSuccess(e));
    }
  };
}

export function signUpUserByEmailThunk({ email, password, name }) {
    return async (dispatch) => {
      dispatch(authActions.signupLoading());
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await updateProfile(userCredential.user, {
            displayName: name
        })
        dispatch(authActions.signupSuccess());
      } catch (e) {
        dispatch(authActions.signupError(e));
      }
    };
  }

  export function validateUserThunk() {
    return (dispatch, getState) => {
      const authState = getState().authReducer
        onAuthStateChanged(auth, (user) => {
          if (user) {
            dispatch(authActions.validateUserSuccess(user));
          } else {
            if(!authState.validateUserLoading){
              dispatch(signOutThunk())
            } else {
              dispatch(authActions.validateUserSuccess());
            }
          }
        }, (e) => {
            dispatch(authActions.validateUserError(e));
        });
    };
  }

  export function signOutThunk() {
    return async (dispatch) => {
        try {
            await signOut(auth)
            dispatch(commonActions.clearRedux())
        } catch (e) {
            dispatch(authActions.signOut(e))
        }
    };
  }
  
