import React from "react";
import { Navigate } from "react-router-dom";

import { User } from "../types/User";

interface Props {
  type: "admin" | "sponsor" | "judge" | "member";
  user: User;
  children: JSX.Element;
}

const ProtectedRoute: React.FC<Props> = props => {
  switch (props.type) {
    case "admin":
      if (props.user && props.user.roles.admin) {
        return props.children;
      }
      return <Navigate to="/" />;
    case "sponsor":
      if (props.user && (props.user.isSponsor || props.user.roles.admin)) {
        return props.children;
      }
      return <Navigate to="/" />;
    case "judge":
      if (props.user && props.user.isJudging) {
        return props.children;
      }
      return <Navigate to="/" />;
    case "member":
      if (props.user && (props.user.roles.member || props.user.roles.admin || props.user.roles.exec)) {
        return props.children;
      }
      return <Navigate to="/" />;
  }
  return <Navigate to="/" />;
};
export default ProtectedRoute;
