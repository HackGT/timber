import React from "react";
import { Route, Redirect } from "react-router-dom";
import { UserRole } from "../types/UserRole";

function SponsorRoute({ component: Component, user, ...rest }: any): any {
  if (user && [UserRole.ADMIN, UserRole.SPONSOR].includes(user.role)) {
    return <Route {...rest} render={(props: any) => <Component {...props} />} />;
  }

  return (
    <Route
      {...rest}
      render={(props: any) => <Redirect to={{ pathname: "/", state: { from: props.location } }} />}
    />
  );
}

export default SponsorRoute;
