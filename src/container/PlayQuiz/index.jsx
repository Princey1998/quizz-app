import {
  Container,
  Backdrop,
  CircularProgress,
  Typography,
  CardContent,
  Card,
  CardActions,
  Button,
} from "@mui/material";
import { useEffect } from "react";
import { getQuizThunk } from "../../redux/thunks/quizThunk";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PlayQuiz = () => {
  const dispatch = useDispatch();
  const { getQuizLoading, quiz } = useSelector((state) => state.quizReducer);
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(getQuizThunk());
  }, []);
  return (
    <Container className="pt-4">
      <Backdrop open={!!getQuizLoading}>
        <CircularProgress />
      </Backdrop>
      {!getQuizLoading && quiz?.length ? (
        <div className="flex flex-wrap items-stretch">
          {quiz.map((q) => (
            <div key={q.id} className="p-2 w-full sm:w-1/2	md:w-1/4 flex-none">
              <Card sx={{ width: "100%", height: "100%" }} className="flex flex-col justify-between">
                <CardContent>
                  <Typography
                    className="break-words"
                    gutterBottom
                    variant="h5"
                    component="div"
                  >
                    {q.title.slice(0, 30).trim() + (q.title.length > 30 ? "..." : "")}
                  </Typography>
                  <Typography
                    className="break-words"
                    variant="body2"
                    color="text.secondary"
                  >
                    {q.description.slice(0, 100).trim() + (q.description.length > 100 ? "..." : "")}
                  </Typography>
                </CardContent>
                <CardActions >
                  <Button className="!ml-auto" size="small" onClick={() => navigate(`/play-quiz/${q.id}`)}>Play Quiz</Button>
                </CardActions>
              </Card>
            </div>
          ))}
        </div>
      ) : null}
    </Container>
  );
};

export default PlayQuiz;
