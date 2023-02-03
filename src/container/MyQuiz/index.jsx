import { Container, Backdrop, CircularProgress } from "@mui/material";
import * as quizActions from "../../redux/actions/quizActions";
import { useDispatch, useSelector } from "react-redux";
import {
  getMyQuizThunk,
  updateMyQuizByIdThunk,
  deleteMyQuizByIdThunk,
} from "../../redux/thunks/quizThunk";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Switch,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import format from "date-fns/format";

const MyQuiz = () => {
  const quizState = useSelector((state) => state.quizReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlePublishChange = (quiz) => {
    dispatch(
      updateMyQuizByIdThunk({
        id: quiz.id,
        quiz: {
          ...quiz,
          isEdit: true,
          publish: !quiz.publish,
        },
      })
    );
  };

  const handleDelete = (quizId) => {
    dispatch(
      deleteMyQuizByIdThunk({
        id: quizId,
      })
    );
  };

  useEffect(() => {
    dispatch(getMyQuizThunk());
  }, []);

  return (
    <Container>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={!!quizState?.getMyQuizLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="py-8">
        <div className="flex justify-between items-center mb-8">
          <Typography variant="h4" component="h1">
            My Quizes
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/create-new-quiz")}
          >
            Create New Quiz
          </Button>
        </div>
        {!quizState?.getMyQuizLoading && quizState.myQuiz.ids.length ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Quiz No</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created On</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {quizState.myQuiz.ids.map((id, i) => (
                  <TableRow key={id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{quizState.myQuiz.entities[id].title}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-12">
                          {quizState.updateMyQuizByIdLoading.has(id) ? (
                            <CircularProgress size={25} />
                          ) : quizState.myQuiz.entities[id].publish ? (
                            "Active"
                          ) : (
                            "Inactive"
                          )}
                        </div>
                        <div className="ml-2">
                          <Switch
                            onChange={() =>
                              handlePublishChange(quizState.myQuiz.entities[id])
                            }
                            color={
                              quizState.myQuiz.entities[id].publish
                                ? "success"
                                : "secondary"
                            }
                            checked={quizState.myQuiz.entities[id].publish}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(
                        quizState.myQuiz.entities[id]._createdOn.toDate(),
                        "MM/dd/yyyy hh:mm a"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-x-1	">
                        {quizState.deleteMyQuizByIdLoading.has(id) ? (
                          <CircularProgress size={25} />
                        ) : (
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/my-quiz/${id}`)}
                        >
                          <EditIcon />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : null}
      </div>
    </Container>
  );
};

export default MyQuiz;
