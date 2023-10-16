import { FC } from "react";

interface Session {
  id: string;
  title: string;
}

interface NavbarProps {
  username?: string;
  sessions?: Session[];
}

export const Navbar: FC<NavbarProps> = ({ username, sessions }) => {
  return (
    <div className="navbar bg-primary text-primary-content">
      <div className="navbar-start">
        <div className="dropdown">
          <div className="drawer">
            <input id="sessions-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
              {/* Page content here */}
              <label htmlFor="sessions-drawer" className="btn btn-circle btn-ghost">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </label>
            </div>
            <div className="drawer-side">
              <label htmlFor="sessions-drawer" aria-label="close sidebar" className="drawer-overlay" />
              <ul className="menu min-h-full w-80 bg-base-200 p-4 text-base-content">
                <h2 className="mb-4 flex items-center border-b-2 border-b-base-content text-xl font-medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="mr-2 h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Sessions
                </h2>
                {sessions ? (
                  sessions.map(({ id, title }) => (
                    <li key={id}>
                      <a>{title}</a>
                    </li>
                  ))
                ) : (
                  <span className="text-center text-sm">Please login first!</span>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="navbar-center">
        <a href="/" className="text-2xl font-medium">
          LISTavia
        </a>
      </div>
      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="avatar btn btn-circle btn-ghost rounded-full text-xl ring-1 ring-purple-400">
            <span>GS</span>
          </label>
          <ul
            tabIndex={0}
            className="menu dropdown-content rounded-box menu-sm z-[1] mt-3 w-52 bg-base-100 p-2 font-medium text-base-content shadow"
          >
            <li>
              <span>
                Name: <b>Geet Sethi</b>
              </span>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
