import {
  collection,
  doc,
  writeBatch,
  query,
  where,
  getDocs,
  orderBy,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../../firebase";
import * as quizActions from "../actions/quizActions";

export function createNewQuizThunk({ quiz, quizQuestions }) {
  return async (dispatch) => {
    dispatch(quizActions.createNewQuizLoading());
    try {
      const user = auth.currentUser;
      const batch = writeBatch(db);
      const newQuizRef = doc(collection(db, "quizs"));
      const newQuizData = {
        ...quiz,
        id: newQuizRef.id,
        createdBy: user.uid,
        _createdOn: new Date(),
        _updatedOn: new Date(),
      };
      batch.set(newQuizRef, newQuizData);
      quizQuestions.forEach((question) => {
        const newQuestionsRef = doc(collection(db, "questions"));
        batch.set(newQuestionsRef, {
          title: question.title,
          options: question.options,
          id: newQuestionsRef.id,
          quizId: newQuizData.id,
        });
      });

      await batch.commit();
      dispatch(quizActions.createNewQuizSuccess(newQuizData));
    } catch (e) {
      console.log(e);
      dispatch(quizActions.createNewQuizError(e));
    }
  };
}

export function getMyQuizThunk() {
  return async (dispatch, getState) => {
    dispatch(quizActions.getMyQuizLoading());
    try {
      const user = auth.currentUser;
      const { lastMyQuizUpdatedOn } = getState().quizReducer;
      const queryConstraints = [
        where("createdBy", "==", user.uid),
        orderBy("_updatedOn", "desc"),
        where("_updatedOn", ">", lastMyQuizUpdatedOn),
        orderBy("_createdOn", "desc"),
      ];
      const q = query(collection(db, "quizs"), ...queryConstraints);

      const querySnapshot = await getDocs(q);
      const quizList = [];
      let lastUpdatedOn = lastMyQuizUpdatedOn;
      querySnapshot.forEach((doc) => {
        const quiz = doc.data();
        lastUpdatedOn =
          lastUpdatedOn && quiz._updatedOn.toDate() > lastUpdatedOn
            ? quiz._updatedOn.toDate()
            : lastUpdatedOn || quiz._updatedOn.toDate();
        quizList.push(quiz);
      });
      dispatch(
        quizActions.getMyQuizSuccess({
          quizList,
          lastUpdatedOn,
        })
      );
    } catch (e) {
      console.log(e);
      dispatch(quizActions.getMyQuizError(e));
    }
  };
}

export function updateMyQuizByIdThunk({ id, quiz, quizQuestions }) {
  return async (dispatch, getState) => {
    
    dispatch(quizActions.updateMyQuizByIdLoading(id));
    try {
      const batch = writeBatch(db);
      const quizState = getState().quizReducer
      const { quizById } = quizState
      let newQuizById = null;

      if (quiz && quiz.isEdit) {
        const quizRef = doc(db, "quizs", id);
        delete quiz.isEdit;
        batch.update(quizRef, {
          ...quiz,
          _updatedOn: new Date(),
        });
      }
    
      if(quizById){
        newQuizById = {
          quiz,
          quizQuestions: {...quizById.quizQuestions}
        }
      }

      if (quizQuestions) {
        quizQuestions.forEach((question) => {
          if (question.isEdit) {
            delete question.isEdit;
            const questionRef = doc(db, "questions", question.id);
            const updatedData = {
              title: question.title,
              options: question.options,
              id: question.id,
              quizId: question.quizId,
            }
            batch.update(questionRef, updatedData);

            if(newQuizById){
              newQuizById.quizQuestions[question.id] = updatedData
            }
          }

          if (question.isDelete) {
            delete question.isDelete;
            const questionRef = doc(db, "questions", question.id);
            batch.delete(questionRef);

            if(newQuizById){
             delete newQuizById.quizQuestions[question.id]
            }
          }

          if (question.isNew) {
            delete question.isNew;
            const newQuestionsRef = doc(collection(db, "questions"));
            const newData = {
              title: question.title,
              options: question.options,
              id: newQuestionsRef.id,
              quizId: quiz.id,
            }
            batch.set(newQuestionsRef, newData);

            if(newQuizById){
              newQuizById.quizQuestions[newQuestionsRef.id] = newData
            }
          }
        });
      }
      await batch.commit();
      dispatch(
        quizActions.updateMyQuizByIdSuccess({
          id,
          myQuiz: {
            ...quiz,
            id,
          },
          quizById: newQuizById
        })
      );
    } catch (e) {
      console.log(e);
      dispatch(
        quizActions.updateMyQuizByIdError({
          id,
          error: e,
        })
      );
    }
  };
}

export function deleteMyQuizByIdThunk({ id }) {
  return async (dispatch, getState) => {
    dispatch(quizActions.deleteMyQuizByIdLoading(id));
    try {
      const batch = writeBatch(db);
      const quizRef = doc(db, "quizs", id);
      batch.delete(quizRef);
      const q = query(collection(db, "questions"), where("quizId", "==", id));
      const questionsSnapshot = await getDocs(q);
      questionsSnapshot.forEach((questionDoc) => {
        const questionRef = doc(db, "questions", questionDoc.id);
        batch.delete(questionRef);
      });
      await batch.commit();
      dispatch(quizActions.deleteMyQuizByIdSuccess({ id }));
    } catch (e) {
      console.log(e);
      dispatch(
        quizActions.deleteMyQuizByIdError({
          id,
          error: e,
        })
      );
    }
  };
}

export function getQuizThunk() {
  return async (dispatch, getState) => {
    dispatch(quizActions.getQuizLoading());
    try {
      const q = query(collection(db, "quizs"), where("publish", "==", true), orderBy("_createdOn", "desc"));
      const querySnapshot = await getDocs(q);
      const quizList = [];
      querySnapshot.forEach((doc) => {
        const quiz = doc.data();
        quizList.push(quiz);
      });
      dispatch(quizActions.getQuizSuccess(quizList));
    } catch (e) {
      console.log(e);
      dispatch(quizActions.getQuizError(e));
    }
  };
}

export function getQuizByIdThunk({ id }) {
  return async (dispatch, getState) => {
    dispatch(quizActions.getQuizByIdLoading());
    try {
      const docRef = doc(db, "quizs", id);
      const docSnap = await getDoc(docRef);
      const quiz = docSnap.exists() ? docSnap.data() : null;
      if (quiz) {
        const q = query(collection(db, "questions"), where("quizId", "==", id));
        const querySnapshot = await getDocs(q);
        const quizQuestions = {};
        querySnapshot.forEach((doc) => {
          const question = doc.data();
          quizQuestions[question.id] = question;
        });
        dispatch(
          quizActions.getQuizByIdSuccess({
            quiz,
            quizQuestions,
          })
        );
      } else {
        throw new Error("Quiz is not available");
      }
    } catch (e) {
      console.log(e);
      dispatch(quizActions.getQuizError(e));
    }
  };
}
