import React from "react";
import { Link, useLocation } from "react-router-dom";
import MaterialUILink from "@material-ui/core/Link";

import styles from "./header.module.css";
import { Page } from "./Navigation";
import Logo from "./Logo";

interface Props {
  routes: Page[];
}

const Header: React.FC<Props> = props => {
  const location = useLocation()?.pathname;

  return (
    <header>
      <div>
        <Logo />
      </div>
      <div className={styles.right}>
        {props.routes.map(route => (
          <MaterialUILink
            className={
              location === route.link ? `${styles.link} ${styles.link_active}` : `${styles.link}`
            }
            color="textPrimary"
          >
            <Link to={route.link}>{route.name}</Link>
          </MaterialUILink>
        ))}
      </div>
    </header>
  );
};

export default Header;
