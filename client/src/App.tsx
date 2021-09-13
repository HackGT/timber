import React from "react";
import useAxios from "axios-hooks";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Navigation from "./components/navigation/Navigation";
import Dashboard from "./components/dashboard/Dashboard";
import Projects from "./components/projects/Projects";
import JudgingHome from "./components/judging/JudgingHome";
import AdminHome from "./components/admin/AdminHome";
import Footer from "./components/navigation/Footer";

function App() {
  const [{ data, loading, error }] = useAxios("/auth/check");

  if (loading) {
    return <p>Loading</p>;
  }

  if (error) {
    return <p>Error</p>;
  }

  return (
    <div>
      <Router>
        <Navigation user={data} />
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/projects" component={Projects} />
          <Route exact path="/judging" component={JudgingHome} />
          <Route exact path="/admin" component={AdminHome} />
        </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
