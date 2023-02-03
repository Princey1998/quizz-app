import {
  Button,
  TextField,
  Container,
  Typography,
  Checkbox,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getQuizByIdThunk,
} from "../../redux/thunks/quizThunk";
import {
    createResultThunk
} from "../../redux/thunks/resultThunk"
import { useParams } from "react-router-dom";
import { cloneDeep } from "lodash";

const quizTypeMap = {
  "mcq-single-correct": "MCQ (Single Correct)",
  "mcq-multi-correct": "MCQ (Multi Correct)",
};

const Quiz = () => {
  const dispatch = useDispatch();
  const { quizById, getQuizByIdLoading } = useSelector(
    (state) => state.quizReducer
  );
  const params = useParams();
  const [quiz, setQuiz] = useState();
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [answers, setAnswers] = useState(new Map());
  const [isSubmit, setIsSubmit] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [totalNumber, setTotalNumber] = useState(0);

  const handleCorrectAnswer = (questionId, optionIndex) => {
    if (isSubmit) {
      return;
    }
    if (quiz.type === "mcq-single-correct") {
      setAnswers((answer) => {
        if (answer.has(questionId)) {
          if (answer.get(questionId).has(optionIndex)) {
            answer.get(questionId).delete(optionIndex);
          } else {
            answer.get(questionId).clear();
            answer.get(questionId).add(optionIndex);
          }
        } else {
          answer.set(questionId, new Set([optionIndex]));
        }

        return new Map(answer);
      });
    }
    if (quiz.type === "mcq-multi-correct") {
      setAnswers((answer) => {
        if (answer.has(questionId)) {
          if (answer.get(questionId).has(optionIndex)) {
            answer.get(questionId).delete(optionIndex);
          } else {
            answer.get(questionId).add(optionIndex);
          }
        } else {
          answer.set(questionId, new Set([optionIndex]));
        }

        return new Map(answer);
      });
    }
  };

  const handleSubmit = () => {
    let totalNumber = 0;
    const quizQuestionsMap = quizById.quizQuestions
    answers.forEach((ans, key) => {
      const question = quizQuestionsMap[key];
      let number = 1
      ans.forEach((val) => {
        const option = question.options[val];
        if (!option.isAnswer) {
            number = 0
        }
      });

      totalNumber = totalNumber + number
    });
    setTotalNumber(totalNumber);
    setIsSubmit(true);
    setShowResultDialog(true);
    dispatch(createResultThunk({
        quiz,
        totalNumber,
        totalQuestion: quizQuestions.length
    }))
  };

  const handlePlayAgain = () => {
    setAnswers(new Map());
    setTotalNumber(0);
    setIsSubmit(false);
    setShowResultDialog(false);
  };

  useEffect(() => {
    if (quizById) {
      setQuiz(quizById.quiz);
      setQuizQuestions(
        Object.keys(quizById.quizQuestions).map((key) =>
          cloneDeep(quizById.quizQuestions[key])
        )
      );
    }
  }, [quizById]);

  useEffect(() => {
    dispatch(getQuizByIdThunk({ id: params.quizId }));
  }, [params]);
  return (
    <Container className="py-8">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={!!getQuizByIdLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {!getQuizByIdLoading && quiz ? (
        <>
          <Typography align="center" variant="h4" component="h1" gutterBottom>
            Play Quiz - {quizTypeMap[quiz.type]}
          </Typography>
          <div className="flex flex-col gap-y-3 mb-4">
            <Typography gutterBottom variant="h5" component="div">
              {quiz.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {quiz.description}
            </Typography>
          </div>
          {quizQuestions.map((question, questionIndex) => (
            <div
              key={questionIndex}
              className={`mb-8  p-4 rounded-md ${
                question?.isDelete
                  ? "bg-red-200"
                  : question?.isEdit
                  ? " bg-amber-200"
                  : "bg-gray-50"
              }`}
            >
              <p className="w-full text-right mb-2 px-2">
                Question {questionIndex + 1}
              </p>
              <div className="mb-4 flex justify-center items-center">
                <TextField
                  className="w-full !mx-2"
                  label={"Question " + (questionIndex + 1)}
                  defaultValue={question.title}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </div>

              <div className="flex flex-wrap">
                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className="flex-none w-full sm:w-1/2 p-2"
                  >
                    <div className="border-2 border-gray-400 rounded">
                      <div className="flex  p-4 w-full justify-between items-center mb-4">
                        <TextField
                          className="flex-auto	"
                          label={"Option " + (optionIndex + 1)}
                          size="small"
                          defaultValue={option.val}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </div>
                      <div className="w-full  px-4 py-2 text-right bg-gray-200">
                        <label>
                          <Checkbox
                            color={
                              !isSubmit
                                ? "primary"
                                : option.isAnswer
                                ? "success"
                                : "error"
                            }
                            onChange={(e) =>
                              handleCorrectAnswer(question.id, optionIndex)
                            }
                            checked={
                              !isSubmit
                                ? !!answers.get(question.id)?.has(optionIndex)
                                : !!answers
                                    .get(question.id)
                                    ?.has(optionIndex) || option.isAnswer
                            }
                            size="small"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="text-center">
            <Button
              variant="contained"
              onClick={isSubmit ? handlePlayAgain : handleSubmit}
            >
              {isSubmit ? "Play Again" : "Submit"}
            </Button>
          </div>
          <Dialog
            open={showResultDialog}
            onClose={() => setShowResultDialog(false)}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle id="alert-dialog-title">Result</DialogTitle>
            <DialogContent>
              <DialogContentText>
                  Total Score = {`${totalNumber} / ${quizQuestions.length}`}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowResultDialog(false)}>Review</Button>
              <Button
                onClick={handlePlayAgain}
              >
                Play Again
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : null}
    </Container>
  );
};

export default Quiz;
