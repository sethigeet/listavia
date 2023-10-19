import { FC } from "react";

import { ClockIcon, MenuIcon, UserIcon } from "../icons";

interface Session {
  id: string;
  title: string;
}

interface NavbarProps {
  username?: string;
  sessions?: Session[];
  logoutFn?: () => void;
}

export const Navbar: FC<NavbarProps> = ({ username, sessions, logoutFn = () => {} }) => {
  return (
    <div className="navbar bg-primary text-primary-content">
      <div className="navbar-start">
        <div className="dropdown">
          <div className="drawer">
            <input id="sessions-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
              <label htmlFor="sessions-drawer" className="btn btn-circle btn-ghost">
                <MenuIcon className="h-5 w-5" />
              </label>
            </div>
            <div className="drawer-side">
              <label htmlFor="sessions-drawer" aria-label="close sidebar" className="drawer-overlay" />
              <ul className="menu min-h-full w-80 bg-base-200 p-4 text-base-content">
                <h2 className="mb-4 flex items-center border-b-2 border-b-base-content text-xl font-medium">
                  <ClockIcon className="mr-2 h-6 w-6" />
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
        {username ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="avatar btn btn-circle btn-ghost rounded-full text-xl ring-1 ring-purple-400">
              <UserIcon className="h-6 w-6" />
            </label>
            <ul
              tabIndex={0}
              className="menu dropdown-content rounded-box menu-md z-[1] mt-3 w-52 bg-base-100 p-2 font-medium text-base-content shadow"
            >
              <li>
                <span>
                  Username: <b>{username}</b>
                </span>
              </li>
              <li>
                <button onClick={() => logoutFn()}>Logout</button>
              </li>
            </ul>
          </div>
        ) : (
          <button className="btn btn-ghost">Login</button>
        )}
      </div>
    </div>
  );
};
