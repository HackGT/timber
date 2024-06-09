import React from "react";
import { Tabs, Typography } from "antd";
import useAxios from "axios-hooks";
import { apiUrl, Service } from "@hex-labs/core";

import ProjectTableContainer from "./ProjectTableContainer";
import RankingTable from "./RankingTable";
import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";
import { useCurrentHexathon } from "../../contexts/CurrentHexathonContext";

const { Title } = Typography;
const { TabPane } = Tabs;

const ProjectStatusHome: React.FC = () => {
  const CurrentHexathonContext = useCurrentHexathon();
  const { currentHexathon } = CurrentHexathonContext;

  const [{ loading: projectsLoading, data: projectsData, error: projectsError }, refetchProjects] =
    useAxios({
      method: "GET",
      url: apiUrl(Service.EXPO, "/projects"),
      params: {
        hexathon: currentHexathon?.id,
      },
    });

  if (projectsLoading) {
    return <LoadingDisplay />;
  }

  if (projectsError) {
    return <ErrorDisplay error={projectsError} />;
  }

  console.log(projectsData)
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
