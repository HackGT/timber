import React from "react";
import { Route, Redirect } from "react-router-dom";

function JudgeRoute({ component: Component, user, ...rest }: any): any {
  if (user && user.isJudging) {
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
