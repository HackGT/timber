import React, { useState } from "react";
import { Tabs, Typography } from "antd";
import useAxios from "axios-hooks";
import { apiUrl, Service } from "@hex-labs/core";

import ProjectTableContainer from "./ProjectTableContainer";
import RankingTable from "./RankingTable";
import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";
import { useCurrentHexathon } from "../../contexts/CurrentHexathonContext";
import ProjectStatusFiltering from "./ProjectStatusFiltering";
import { Text } from "@chakra-ui/react";

const { Title } = Typography;
const { TabPane } = Tabs;

const ProjectStatusHome: React.FC = () => {
  const CurrentHexathonContext = useCurrentHexathon();
  const { currentHexathon } = CurrentHexathonContext;
  const [expoNum, setExpoNum] = useState(null);
  const [roundNum, setRoundNum] = useState(null);

  const [{ loading: projectsLoading, data: projectsData, error: projectsError }, refetchProjects] =
    useAxios({
      method: "GET",
      url: apiUrl(Service.EXPO, "/projects"),
      params: {
        expo: expoNum,
        round: roundNum,
        hexathon: currentHexathon?.id,
      },
    });

  console.log(projectsData);

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
          <ProjectStatusFiltering
            expoNum={expoNum}
            setExpoNum={setExpoNum}
            roundNum={roundNum}
            setRoundNum={setRoundNum}
          />
          {projectsData.length === 0 ? (
            <Text>No projects match your search</Text>
          ) : (
            <ProjectTableContainer
              projects={projectsData}
              isSponsor={false}
              refetch={refetchProjects}
            />
          )}
        </TabPane>
        <TabPane tab="Rankings" key="2">
          <RankingTable />
        </TabPane>
      </Tabs>
    </>
  );
};

export default ProjectStatusHome;
