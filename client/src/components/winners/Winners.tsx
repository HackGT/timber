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
  const [{ loading: winnersLoading, data: winnersData, error: winnersError }, refetchWinners] =
    useAxios("/winners");
    

  if (projectsLoading || winnersLoading) {
    return <LoadingDisplay />;
  }


  if (projectsError) {
    return <ErrorDisplay error={projectsError} />;
  }
  if (winnersError) {
    return <ErrorDisplay error={winnersError} />;
  }

  const winnersChoices = winnersData
    ? winnersData.map((item: any) => (
        <Card
            title={item.id}
          >
            <p> content </p>
        </Card>
      ))
    : [];


  return (
    <>
      <Title level={2}>Winners</Title>
      <div>
        {winnersChoices}
      </div>
    </>
  );
};

export default Winners;
