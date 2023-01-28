import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
  {
    path: "/login",
    element: <div>login!</div>,
  },
  {
    path: "/singup",
    element: <div>signup!</div>,
  },
  {
    path: "/create-quiz",
    element: <div>create-quiz!</div>,
  },
  {
    path: "/my-quiz",
    element: <div>my-quiz!</div>,
  },
  {
    path: "/play-quiz",
    element: <div>play-quiz!</div>,
  },
  {
    path: "/result",
    element: <div>result!</div>,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
