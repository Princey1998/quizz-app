import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const menuData = useMemo(
    () => [
      {
        path: "/create-new-quiz",
        label: " Create New Quiz",
      },
      {
        path: "/my-quiz",
        label: "My Quiz",
      },
      {
        path: "/play-quiz",
        label: "Play Quiz",
      },
      {
        path: "/results",
        label: "Results",
      },
    ],
    []
  );
  return (
    <div className="p-4">
      <div className="flex flex-wrap flex-row justify-center w-full max-w-4xl	m-auto">
        {menuData.map(({ path, label }, i) => (
          <div key={i}className="w-full sm:w-1/2 p-2 h-28 flex-none">
            <div
              className="w-full h-full flex items-center justify-center bg-blue-600 text-white rounded text-xl cursor-pointer hover:bg-blue-500"
              onClick={() => navigate(path)}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
