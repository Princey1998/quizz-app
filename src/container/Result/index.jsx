import { Container, Backdrop, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  getResultsThunk
} from "../../redux/thunks/resultThunk";
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
  Typography,
  Button,
} from "@mui/material";

import format from "date-fns/format";

const Result = () => {
  const { results, getResultsLoading } = useSelector((state) => state.resultReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  useEffect(() => {
    dispatch(getResultsThunk());
  }, []);

  return (
    <Container>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={!!getResultsLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="py-8">
        <div className="flex justify-between items-center mb-8">
          <Typography variant="h4" component="h1">
            Results
          </Typography>
        </div>
        {!getResultsLoading && results.length ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>Quiz Title</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>Played On</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((result, i) => (
                  <TableRow key={result.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{result.quizTitle}</TableCell>
                    <TableCell>
                       { `${result.totalNumber} / ${result.totalQuestion}` }
                    </TableCell>
                    <TableCell>
                      {format(
                        result._createdOn.toDate(),
                        "MM/dd/yyyy hh:mm a"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center items-center gap-x-1	">
                        <Button
                          size="small"
                          onClick={() => navigate(`/play-quiz/${result.quizId}`)}
                        >
                          Play Again
                        </Button>
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

export default Result;