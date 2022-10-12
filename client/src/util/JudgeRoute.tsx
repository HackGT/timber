import React from "react";
import { Route, Navigate } from "react-router-dom";

function JudgeRoute({ component: Component, user, ...rest }: any): any {
  if (user && user.isJudging) {
    return <Route {...rest} />;
  }

  return <Route {...rest} element={<Navigate to="/" />} />;
}

export default JudgeRoute;
