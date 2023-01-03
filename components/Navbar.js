import Link from "next/link";
import React from "react";

const navStyles = {
  navList: {
    display: "flex",
    justifyContent: "center",
  },
  navItem: {
    marginLeft: "3rem",
    marginRight: "3rem",
    listStyle: "none",
    fontWeight: "bold",
  },
};

const Navbar = () => {
  return (
    <>
      <nav>
        <ul style={navStyles.navList}>
          <Link href="/">
            <a>
              <li style={navStyles.navItem}>Home</li>
            </a>
          </Link>
          <Link href="/profile">
            <a>
              <li style={navStyles.navItem}>Profile</li>
            </a>
          </Link>
          <Link href="/teams">
            <a>
              <li style={navStyles.navItem}>My Teams</li>
            </a>
          </Link>
          <Link href="/vacancies">
            <a>
              <li style={navStyles.navItem}>Teams</li>
            </a>
          </Link>
          <Link href="/users">
            <a>
              <li style={navStyles.navItem}>Users</li>
            </a>
          </Link>
          <Link href="/requests">
            <a>
              <li style={navStyles.navItem}>Requests</li>
            </a>
          </Link>
          <Link href="/login">
            <a>
              <li style={navStyles.navItem}>Login</li>
            </a>
          </Link>
          <Link href="/logout">
            <a>
              <li style={navStyles.navItem}>Logout</li>
            </a>
          </Link>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
