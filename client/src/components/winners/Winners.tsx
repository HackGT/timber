import React from "react";
import { Card, Tabs, Typography } from "antd";
import useAxios from "axios-hooks";

import ProjectTableContainer from "../projectStatus/ProjectTableContainer";
import RankingTable from "../projectStatus/RankingTable";
import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";

const { Title } = Typography;
const { TabPane } = Tabs;

const Winners: React.FC = () => {
  const [{ loading: projectsLoading, data: projectsData, error: projectsError }, refetchProjects] =
    useAxios("/projects");

  if (projectsLoading) {
    return <LoadingDisplay />;
  }

  if (projectsError) {
    return <ErrorDisplay error={projectsError} />;
  }

  return (
    <>
      <Title level={2}>Winners</Title>
      <Card
      title="hi"
    >
      <p> content </p>
    </Card>
      
    </>
  );
};

export default Winners;
