import React from "react";
import { Route, Redirect } from "react-router-dom";
import { UserRole } from "../types/UserRole";

function JudgeRoute({ component: Component, user, ...rest }: any): any {
  if (user && [UserRole.ADMIN, UserRole.SPONSOR].includes(user.role) && user.isJudging) {
    return <Route {...rest} />;
  }

  return (
    <Route
      {...rest}
      render={(props: any) => <Redirect to={{ pathname: "/", state: { from: props.location } }} />}
    />
  );
}

export default JudgeRoute;
