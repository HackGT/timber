import React from "react";
import useAxios from "axios-hooks";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Navigation from "./components/navigation/Navigation";
import Dashboard from "./components/dashboard/Dashboard";
import Projects from "./components/projects/Projects";
import JudgingHome from "./components/judging/JudgingHome";
import AdminHome from "./components/admin/AdminHome";
import Footer from "./components/navigation/Footer";
import SubmissionFormContainer from "./components/create/SubmissionFormContainer";
import NotFoundDisplay from "./displays/NotFoundDisplay";
import ErrorDisplay from "./displays/ErrorDisplay";
import LoadingDisplay from "./displays/LoadingDisplay";
import ProjectDetails from "./components/dashboard/ProjectDetails";

function App() {
  const [{ data, loading, error }] = useAxios("/auth/check");

  if (loading) {
    return <LoadingDisplay />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <div>
      <Router>
        <Navigation user={data} />
        <div style={{ padding: "20px" }}>
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/create" render={() => <SubmissionFormContainer user={data} />} />
            <Route exact path="/projects" component={Projects} />
            <Route exact path="/projects/:projectId" component={ProjectDetails} />
            <Route exact path="/judging" component={JudgingHome} />
            <Route exact path="/admin/:activeTab?" component={AdminHome} />
            <Route component={NotFoundDisplay} />
          </Switch>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
