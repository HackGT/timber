import React from "react";
import useAxios from "axios-hooks";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Layout } from "antd";

import "./App.less";

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
import Epicenter from "./components/epicenter/Epicenter";

import CategoryGroup from "./components/categoryGroup/CategoryGroup";

const { Content } = Layout;

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
        <Layout style={{ minHeight: "100vh" }}>
          <Navigation user={data} />
          <Content style={{ padding: "25px", backgroundColor: "#fff" }}>
            <Switch>
              <Route exact path="/" component={Dashboard} />
              <Route exact path="/create" render={() => <SubmissionFormContainer user={data} />} />
              <Route exact path="/projects" component={Projects} />
              <Route exact path="/projects/:projectId" component={ProjectDetails} />
              <Route exact path="/projects/special/category-group/:categoryGroupId" component={CategoryGroup}/>
              <Route exact path="/projectgallery" component={Projects} />
              <Route exact path="/projectgallery/:projectId" component={ProjectDetails} />
              <Route exact path="/judging" component={JudgingHome} />
              <Route exact path="/admin/:activeTab?" component={AdminHome} />
              <Route exact path="/epicenter" component={Epicenter} />
              <Route component={NotFoundDisplay} />
            </Switch>
          </Content>
          <Footer />
        </Layout>
      </Router>
    </div>
  );
}

export default App;
