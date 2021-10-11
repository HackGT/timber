import React from "react";
import useAxios from "axios-hooks";
import { Typography, Tabs } from "antd";

import JudgingBox from "./JudgingBox";
import { Project } from "../../types/Project";
import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";
import Dashboard from "./Dashboard";
import Ranking from "./Ranking";

const { Title } = Typography;
const { TabPane } = Tabs;

const Epicenter: React.FC = () => {
  const [{ loading, data, error }] = useAxios("/projects");

  if (loading) {
    return <LoadingDisplay />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  const projects = data.map((project: Project) => (
    <JudgingBox key={project.id} project={project} />
  ));

  return (
    <>
      <Title level={2}>Epicenter</Title>
      <div id="judging">{projects}</div>
      <Title level={2} style={{ textAlign: "center" }}>
        Dashboard
      </Title>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Overview" key="1">
          <Dashboard />
        </TabPane>
        <TabPane tab="Rankings" key="2">
          <Ranking />
        </TabPane>
      </Tabs>
    </>
  );
};

export default Epicenter;
