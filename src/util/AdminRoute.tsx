import React from "react";
import { Route, Navigate } from "react-router-dom";

function AdminRoute({ component: Component, user, ...rest }: any): any {
  if (user && user.roles.admin) {
    return <Route {...rest} element={<Component />} />;
  }

  return <Route {...rest} element={<Navigate to="/" />} />;
}

export default AdminRoute;
