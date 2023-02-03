import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  TextField,
  Container,
  Typography,
  IconButton,
  Checkbox,
  Backdrop,
  CircularProgress,
  DialogContentText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewQuizThunk } from "../../redux/thunks/quizThunk";
import * as quizActions from "../../redux/actions/quizActions";
import { useNavigate } from "react-router-dom";

const quizTypeMap = {
  "mcq-single-correct": "MCQ (Single Correct)",
  "mcq-multi-correct": "MCQ (Multi Correct)",
};

const CreateNewQuiz = () => {
  const dispatch = useDispatch();
  const quizState = useSelector((state) => state.quizReducer);
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(true);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    type: "mcq-single-correct",
    publish: false,
  });

  const [quizQuestions, setQuizQuestions] = useState([]);

  const handleSave = () => {
    if (quiz.title) {
    }
    dispatch(
      createNewQuizThunk({
        quiz,
        quizQuestions,
      })
    );
  };

  const handleQuizTitle = (e) => {
    setQuiz((prev) => ({
      ...prev,
      title: e.target.value,
    }));
  };

  const handleQuizDescription = (e) => {
    setQuiz((prev) => ({
      ...prev,
      description: e.target.value,
    }));
  };

  const handleQuizType = (e) => {
    setQuiz((prev) => ({
      ...prev,
      type: e.target.value,
    }));
  };

  const handleAddQuestion = () => {
    setQuizQuestions((prev) => [
      ...prev,
      {
        title: "",
        options: [],
      },
    ]);
  };

  const handleQuestionTitle = (e, questionIndex) => {
    setQuizQuestions((prev) => {
      const question = prev[questionIndex];
      question.title = e.target.value;

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
      return [...prev];
    });
  };

  const handleQuestionDelete = (questionIndex) => {
    setQuizQuestions((prev) => {
      const newQuestionsList = prev.filter((value, i) => questionIndex !== i);

      return newQuestionsList;
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

      return [...prev];
    });
  };

  const handleNewOptionText = (e, questionIndex) => {
    setQuizQuestions((prev) => {
      const question = prev[questionIndex];
      question.newOptionText = e.target.value;

      return [...prev];
    });
  };

  const handleOptionValue = (e, questionIndex, optionIndex) => {
    setQuizQuestions((prev) => {
      const question = prev[questionIndex];
      const options = question.options[optionIndex];
      options.val = e.target.value;
      return [...prev];
    });
  };

  const handleReset = () => {
    setQuiz({
      title: "",
      description: "",
      type: "mcq-single-correct",
      publish: false,
    });
    setQuizQuestions([]);
  };

  const handleSuccessDialogClose = () => {
    dispatch(quizActions.createNewQuizReset());
    setShowSuccessDialog(false);
    setShowDialog(true);
  };
  useEffect(() => {
    if (quizState?.newQuiz) {
      setShowSuccessDialog(true);
      handleReset();
    }
  }, [quizState?.newQuiz]);

  useEffect(() => {
    return () => {
      dispatch(quizActions.createNewQuizReset());
    };
  }, []);

  return (
    <Container className="py-4">
      <Typography align="center" variant="h4" component="h1" gutterBottom>
        Create New Quiz - {quizTypeMap[quiz.type]}
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
        <div key={questionIndex} className="mb-8 bg-gray-50 p-4 rounded-md">
          <p className="w-full text-right mb-2 px-2">Question {questionIndex + 1}</p>
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
                    <DeleteIcon />
                  </IconButton>
                ),
              }}
            />
          </div>
          <div className="flex flex-wrap">
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex-none w-full sm:w-1/2 p-2">
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
                      onChange={(e) => handleNewOptionText(e, questionIndex)}
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
        <Button variant="contained" onClick={handleSave} disabled={!quiz.title}>
          Save
        </Button>
      </div>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={!!quizState?.createNewQuizLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Dialog open={showDialog}>
        <DialogTitle>Select Question Type</DialogTitle>
        <DialogContent>
          <FormControl onChange={handleQuizType}>
            <RadioGroup value={quiz.type}>
              {Object.keys(quizTypeMap).map((key) => (
                <FormControlLabel
                  key={key}
                  value={key}
                  control={<Radio />}
                  label={quizTypeMap[key]}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button disabled={!quiz.type} onClick={() => setShowDialog(false)}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showSuccessDialog}
        onClose={handleSuccessDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent>
          <DialogContentText>Quiz created successfully!</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessDialogClose}>Close</Button>
          <Button
            onClick={() => navigate(`/my-quiz/${quizState?.newQuiz?.id}`)}
          >
            View Quiz
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreateNewQuiz;
