import React from "react";
import useAxios from "axios-hooks";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Layout } from "antd";

import "./App.less";

import Navigation from "./components/navigation/Navigation";
import Dashboard from "./components/dashboard/Dashboard";
import ProjectGallery from "./components/projectGallery/ProjectGallery";
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
import AdminRoute from "./util/AdminRoute";
import JudgeRoute from "./util/JudgeRoute";
import SponsorRoute from "./util/SponsorRoute";

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
              <Route exact path="/" render={() => <Dashboard user={data} />} />
              <Route exact path="/create" render={() => <SubmissionFormContainer user={data} />} />
              <SponsorRoute exact path="/category-group/:categoryGroupId" component={CategoryGroup} user={data}/>
              <Route exact path="/projectgallery" render={() => <ProjectGallery user={data} />} />
              <Route exact path="/projects/:projectId" component={ProjectDetails} />
              <JudgeRoute exact path="/judging" render={() => <JudgingHome user={data} />} user={data}/>
              <AdminRoute exact path="/admin/:activePane?" component={AdminHome} user={data}/>
              <AdminRoute exact path="/epicenter" component={Epicenter} user={data}/>
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
