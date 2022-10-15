import React, { PropsWithChildren } from "react";
import { Route, Navigate } from "react-router-dom";
import { User } from "../types/User";
import { UserRole } from "../types/UserRole";

interface Props {
  type: "admin" | "sponsor" | "judge";
  user: User;
  children: JSX.Element;
}

const ProtectedRoute: React.FC<Props> = props => {
  switch (props.type) {
    case "admin":
      if (props.user && [UserRole.ADMIN].includes(props.user.role)) {
        return props.children;
      }
      return <Navigate to="/" />;
    case "sponsor":
      if (props.user && [UserRole.ADMIN, UserRole.SPONSOR].includes(props.user.role)) {
        return props.children;
      }
      return <Navigate to="/" />;
    case "judge":
      if (props.user && props.user.isJudging) {
        return props.children;
      }
      return <Navigate to="/" />;
  }
  return <Navigate to="/" />;
};
export default ProtectedRoute;
