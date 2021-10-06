import React from "react";
import useAxios from "axios-hooks";
import { Typography } from "antd";

import JudgingBox from "./JudgingBox";
import { Project } from "../../types/Project";
import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";
import Dashboard from "./Dashboard";

const { Title } = Typography;

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
      <Dashboard />
    </>
  );
};

export default Epicenter;
