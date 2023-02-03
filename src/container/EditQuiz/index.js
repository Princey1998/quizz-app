import {
  Button,
  TextField,
  Container,
  Typography,
  IconButton,
  Checkbox,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getQuizByIdThunk,
  updateMyQuizByIdThunk,
} from "../../redux/thunks/quizThunk";
import * as quizActions from "../../redux/actions/quizActions";
import { useParams } from "react-router-dom";
import { cloneDeep } from "lodash";

const quizTypeMap = {
  "mcq-single-correct": "MCQ (Single Correct)",
  "mcq-multi-correct": "MCQ (Multi Correct)",
};

const EditQuiz = () => {
  const dispatch = useDispatch();
  const { quizById, getQuizByIdLoading, updateMyQuizByIdLoading } = useSelector(
    (state) => state.quizReducer
  );
  const params = useParams();
  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    type: "mcq-single-correct",
    publish: false,
  });

  const [quizQuestions, setQuizQuestions] = useState([]);

  const handleSave = () => {
    dispatch(
      updateMyQuizByIdThunk({
        id: quiz.id,
        quiz: cloneDeep(quiz),
        quizQuestions: cloneDeep(quizQuestions),
      })
    );
  };

  const handleQuizTitle = (e) => {
    setQuiz((prev) => ({
      ...prev,
      isEdit: true,
      title: e.target.value,
    }));
  };

  const handleQuizDescription = (e) => {
    setQuiz((prev) => ({
      ...prev,
      isEdit: true,
      description: e.target.value,
    }));
  };

  const handleAddQuestion = () => {
    setQuizQuestions((prev) => [
      ...prev,
      {
        isNew: true,
        title: "",
        options: [],
      },
    ]);
  };

  const handleQuestionTitle = (e, questionIndex) => {
    setQuizQuestions((prev) => {
      const question = prev[questionIndex];
      question.title = e.target.value;
      if (!question.isNew) {
        question.isEdit = true;
      }
      return [...prev];
    });
  };
  const handleNewOptionAdd = (questionIndex) => {
    setQuizQuestions((prev) => {
      const question = prev[questionIndex];
      question.options.push({
        val: question.newOptionText,
        isAnswer: question.options.length === 0 ? true : false,
      });
      question.newOptionText = "";
      if (!question.isNew) {
        question.isEdit = true;
      }
      return [...prev];
    });
  };

  const handleOptionDelete = (questionIndex, optionIndex) => {
    setQuizQuestions((prev) => {
      const question = prev[questionIndex];
      const newOptionsList = question.options.filter(
        (value, i) => optionIndex !== i
      );
      question.options = newOptionsList;
      if (!question.isNew) {
        question.isEdit = true;
      }
      return [...prev];
    });
  };

  const handleQuestionDelete = (questionIndex) => {
    setQuizQuestions((prev) => {
      const question = prev[questionIndex];
      if (question.isNew) {
        const newQuestionsList = prev.filter((value, i) => questionIndex !== i);

        return newQuestionsList;
      } else {
        const newQuestionsList = prev.map((value, i) => {
          if (questionIndex === i) {
            value.isDelete = !value?.isDelete;
          }

          return value;
        });

        return newQuestionsList;
      }
    });
  };

  const handleCorrectAnswer = (questionIndex, optionIndex) => {
    setQuizQuestions((prev) => {
      const question = prev[questionIndex];
      if (quiz.type === "mcq-single-correct") {
        question.options.map((option, i) => {
          if (i === optionIndex) {
            option.isAnswer = !option.isAnswer;
          } else {
            option.isAnswer = false;
          }

          return option;
        });
      }
      if (quiz.type === "mcq-multi-correct") {
        question.options.map((option, i) => {
          if (i === optionIndex) {
            option.isAnswer = !option.isAnswer;
          }
          return option;
        });
      }
      if (!question.isNew) {
        question.isEdit = true;
      }
      return [...prev];
    });
  };

  const handleNewOptionText = (e, questionIndex) => {
    setQuizQuestions((prev) => {
      const question = prev[questionIndex];
      question.newOptionText = e.target.value;
      if (!question.isNew) {
        question.isEdit = true;
      }
      return [...prev];
    });
  };

  const handleOptionValue = (e, questionIndex, optionIndex) => {
    setQuizQuestions((prev) => {
      const question = prev[questionIndex];
      const options = question.options[optionIndex];
      options.val = e.target.value;

      if (!question.isNew) {
        question.isEdit = true;
      }
      return [...prev];
    });
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
    <Container className="py-4">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={!!getQuizByIdLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {!getQuizByIdLoading && quizById ? (
        <>
          <Typography align="center" variant="h4" component="h1" gutterBottom>
            Edit Quiz - {quizTypeMap[quiz.type]}
          </Typography>

          <div className="flex flex-col gap-y-3 mb-4">
            <TextField
              label="Title"
              onChange={handleQuizTitle}
              value={quiz.title}
            />
            <TextField
              label="Description"
              multiline
              rows={4}
              value={quiz.description}
              onChange={handleQuizDescription}
            />
          </div>
          {quizQuestions.map((question, questionIndex) => (
            <div
              key={questionIndex}
              className={`mb-8  p-4 rounded-md ${
                question?.isDelete ? "bg-red-200" : question?.isEdit ? " bg-amber-200" : "bg-gray-50"
              }`}
            >
              <p className="w-full text-right mb-2 px-2">
                Question {questionIndex + 1}
              </p>
              <div className="mb-4 flex justify-center items-center">
                <TextField
                  className="w-full !mx-2"
                  label={"Question " + (questionIndex + 1)}
                  value={question.title}
                  onChange={(e) => handleQuestionTitle(e, questionIndex)}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        size="small"
                        onClick={() => handleQuestionDelete(questionIndex)}
                      >
                        {question?.isDelete ? <CancelIcon /> : <DeleteIcon />}
                      </IconButton>
                    ),
                  }}
                />
              </div>
              {!!!question?.isDelete && (
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
                            value={option.val}
                            onChange={(e) =>
                              handleOptionValue(e, questionIndex, optionIndex)
                            }
                          />
                          <div className="ml-4">
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleOptionDelete(questionIndex, optionIndex)
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </div>
                        </div>
                        <div className="w-full  px-4 py-2 text-right bg-gray-200">
                          <label>
                            <Typography
                              sx={{
                                marginRight: "5px",
                                verticalAlign: "middle",
                              }}
                              component="span"
                              variant="button"
                            >
                              Correct Answer
                            </Typography>
                            <Checkbox
                              onChange={(e) =>
                                handleCorrectAnswer(questionIndex, optionIndex)
                              }
                              checked={option.isAnswer}
                              size="small"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                  {question.options.length < 4 && (
                    <div className="flex-none w-full sm:w-1/2 p-2">
                      <div className="border-2 border-gray-400 rounded	">
                        <div className="flex  p-4 w-full justify-between items-center mb-4">
                          <TextField
                            className="flex-auto"
                            label="New Answer"
                            size="small"
                            value={question.newOptionText || ""}
                            onChange={(e) =>
                              handleNewOptionText(e, questionIndex)
                            }
                          />
                        </div>
                        <div className="w-full  px-4 py-2 text-right bg-gray-200">
                          <Button
                            disabled={question.newOptionText ? false : true}
                            variant="text"
                            onClick={() => handleNewOptionAdd(questionIndex)}
                          >
                            Done
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {quizQuestions.length < 15 && (
            <div className="text-center">
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddQuestion}
              >
                Add Question
              </Button>
            </div>
          )}
          <div className="text-right">
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!quiz.title}
            >
              Save
            </Button>
          </div>

          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={updateMyQuizByIdLoading.has(quiz?.id)}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </>
      ) : null}
    </Container>
  );
};

export default EditQuiz;
