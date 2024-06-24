import React, { useState } from "react";
import { Tabs, Typography } from "antd";
import useAxios from "axios-hooks";
import { apiUrl, Service } from "@hex-labs/core";
import { Assignment } from "../../types/Assignment";
import { Project } from "../../types/Project";

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
  const [unjudged, setUnjudged] = useState(false);
  const [invalidInput, setInvalidInput] = useState(false);

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
  
  const [{ data: assignments }] = useAxios({
    method: "GET", 
    url: apiUrl(Service.EXPO, "/assignments"), 
    params: {
      hexathon: currentHexathon?.id,
      expo: expoNum, 
      round: roundNum,
    }
  })

  if (projectsLoading) {
    return <LoadingDisplay />;
  }

  if (projectsError) {
    return <ErrorDisplay error={projectsError} />;
  }

  function getUnjudgedProjects() {
    const unjudgedProjectIds = assignments.reduce((accumulator: number[], assignment: Assignment) => {
      if (assignment.status !== "COMPLETED" && !accumulator.includes(assignment.projectId)) {
        accumulator.push(assignment.projectId);
      }
      return accumulator;
    }, []);
    return projectsData.filter((project: Project) => unjudgedProjectIds.includes(project.id));
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
            unjudged={unjudged}
            setUnjudged={setUnjudged}
            setInvalidInput={setInvalidInput}
          />
          {
            (unjudged ? getUnjudgedProjects().length === 0 : projectsData.length === 0) || invalidInput ? (
              <Text>No projects found</Text>
            ) : (
              <ProjectTableContainer
                projects={unjudged ? getUnjudgedProjects() : projectsData}
                isSponsor={false}
                refetch={refetchProjects}
              />
            )
          }
        </TabPane>
        <TabPane tab="Rankings" key="2">
          <RankingTable />
        </TabPane>
      </Tabs>
    </>
  );
};

export default ProjectStatusHome;
