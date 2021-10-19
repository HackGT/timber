import React from "react";
import { Route, Redirect } from "react-router-dom";

function PrivateRoute({ component: Component, user, ...rest }: any): any {
  if (user && user.admin) {
    return <Route {...rest} render={(props: any) => <Component {...props} />} />;
  }

  return (
    <Route
      {...rest}
      render={(props: any) => <Redirect to={{ pathname: "/", state: { from: props.location } }} />}
    />
  );
}

export default PrivateRoute;
