import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './container/Home'
import Signup from "./container/Signup";
import Login from "./container/Login"
import Layout from "./container/Layout";
import CreateNewQuiz from "./container/CreateNewQuiz";
import MyQuiz from "./container/MyQuiz";
import EditQuiz from "./container/EditQuiz";
import PlayQuiz from "./container/PlayQuiz";
import Quiz from "./container/Quiz";
import Result from "./container/Result"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/singup",
        element: <Signup />
      },
      {
        path: "/create-new-quiz",
        element: <CreateNewQuiz />,
      },
      {
        path: "/my-quiz",
        element: <MyQuiz />,
      },
      {
        path: "/my-quiz/:quizId",
        element: <EditQuiz />,
      },
      {
        path: "/play-quiz",
        element: <PlayQuiz />,
      },
      {
        path: "/play-quiz/:quizId",
        element: <Quiz />,
      },
      {
        path: "/results",
        element: <Result />,
      },
    ]
  },
  
]);

function App() {
  return (
      <RouterProvider router={router} />
  );
}

export default App;
