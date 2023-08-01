import React from "react";
import { Route, Navigate } from "react-router-dom";

function SponsorRoute({ component: Component, user, ...rest }: any): any {
  if (user && (user.isSponsor || user.roles.admin)) {
    return <Route {...rest} render={<Component />} />;
  }

  return <Route {...rest} render={<Navigate to="/" />} />;
}

export default SponsorRoute;
