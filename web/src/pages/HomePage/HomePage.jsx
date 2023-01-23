import { Link, Outlet } from "react-router-dom";

import { isUserLoggedIn } from "../../api/utils";

const HomePage = () => {
  const isLoggedIn = isUserLoggedIn();

  return (
    <>
      <nav>
        <ul>
          <li>
            {isLoggedIn ? (
              <Link to="/dashboard">Dashboard</Link>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  );
};

export default HomePage;
