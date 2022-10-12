import React from "react";
import { Route, Navigate } from "react-router-dom";
import { UserRole } from "../types/UserRole";

function AdminRoute({ component: Component, user, ...rest }: any): any {
  if (user && [UserRole.ADMIN].includes(user.role)) {
    return <Route {...rest} element={<Component />} />;
  }

  return <Route {...rest} element={<Navigate to="/" />} />;
}

export default AdminRoute;
