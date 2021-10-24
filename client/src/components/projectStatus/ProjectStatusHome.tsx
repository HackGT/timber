import React from "react";
import { Tabs, Typography } from "antd";
import useAxios from "axios-hooks";

import ProjectTableContainer from "./ProjectTableContainer";
import RankingTable from "./RankingTable";
import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";

const { Title } = Typography;
const { TabPane } = Tabs;

const ProjectStatusHome: React.FC = () => {
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
      <Title level={2}>Project Status</Title>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Overview" key="1">
          <ProjectTableContainer
            projects={projectsData}
            isSponsor={false}
            refetch={refetchProjects}
          />
        </TabPane>
        <TabPane tab="Rankings" key="2">
          <RankingTable />
        </TabPane>
      </Tabs>
    </>
  );
};

export default ProjectStatusHome;
