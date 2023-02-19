import React from "react";
import { Link, useLocation } from "react-router-dom";

import styles from "./header.module.css";
import { Page } from "./Navigation";
import Logo from "./Logo";

interface Props {
  routes: Page[];
}

const Header: React.FC<Props> = props => {
  const location = `/${useLocation()?.pathname.split("/")[1]}`;

  return (
    <header>
      <div>
        <Logo />
      </div>
      <div className={styles.right}>
        {props.routes.map(route => (
          <Link
            to={route.link}
            className={
              location === route.link ? `${styles.link} ${styles.link_active}` : `${styles.link}`
            }
          >
            {route.name}
          </Link>
        ))}
      </div>
    </header>
  );
};

export default Header;
