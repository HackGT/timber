import React from "react";
import { Route, Navigate } from "react-router-dom";
import { UserRole } from "../types/UserRole";

function SponsorRoute({ component: Component, user, ...rest }: any): any {
  if (user && [UserRole.ADMIN, UserRole.SPONSOR].includes(user.role)) {
    return <Route {...rest} render={<Component />} />;
  }

  return <Route {...rest} render={<Navigate to="/" />} />;
}

export default SponsorRoute;
