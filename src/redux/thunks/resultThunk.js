import {
    collection,
    doc,
    writeBatch,
    query,
    where,
    getDocs,
    orderBy,
  } from "firebase/firestore";
  import { db, auth } from "../../firebase";
  import * as resultActions from "../actions/resultActions";
  
  export function createResultThunk({ quiz, totalNumber, totalQuestion }) {
    return async (dispatch) => {
      try {
        const user = auth.currentUser;
        const batch = writeBatch(db);
        const newResultRef = doc(collection(db, "results"));
        const newResultData = {
          totalNumber,
          totalQuestion,
          quizId: quiz.id,
          quizTitle: quiz.title,
          id: newResultRef.id,
          createdBy: user.uid,
          _createdOn: new Date(),
        };
        batch.set(newResultRef, newResultData);
       
        await batch.commit();
      } catch (e) {
        console.log(e);
      }
    };
  }

  export function getResultsThunk() {
    return async (dispatch, getState) => {
      dispatch(resultActions.getResultsLoading());
      try {
        const user = auth.currentUser;
        const { lastResultCreatedOn, results  } = getState().resultReducer;
        const queryConstraints = [
          where("createdBy", "==", user.uid),
          where("_createdOn", ">", lastResultCreatedOn),
          orderBy("_createdOn", "desc"),
        ];
        const q = query(collection(db, "results"), ...queryConstraints);
  
        const querySnapshot = await getDocs(q);
        const resultsList = [];
        let lastCreatedOn = lastResultCreatedOn;
        querySnapshot.forEach((doc) => {
          const result = doc.data();
          lastCreatedOn =
          lastCreatedOn && result._createdOn.toDate() > lastCreatedOn
              ? result._createdOn.toDate()
              : lastCreatedOn || result._createdOn.toDate();
              resultsList.push(result);
        });
        dispatch(
            resultActions.getResultsSuccess({
            results: [...resultsList, ...results],
            lastCreatedOn,
          })
        );
      } catch (e) {
        console.log(e);
        dispatch(resultActions.getResultsError(e));
      }
    };
  }