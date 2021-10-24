import React from "react";
import useAxios from "axios-hooks";
import { Typography, List, Tabs, Button, Alert, message } from "antd";
import axios from "axios";

import JudgingBox from "./JudgingBox";
import { Project } from "../../types/Project";
import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";
import { Assignment } from "../../types/Assignment";
import JudgeCard from "./JudgeCard";
import { User } from "../../types/User";
import RankingTable from "./RankingTable";
import { handleAxiosError } from "../../util/util";
import ProjectTableContainer from "./ProjectTableContainer";

const { Title } = Typography;
const { TabPane } = Tabs;

const Epicenter: React.FC = () => {
  const [{ loading: projectsLoading, data: projectData, error: projectsError }, refetchProjects] =
    useAxios("/projects");
  const [{ loading: userLoading, data: userData, error: userError }, refetchUsers] =
    useAxios("/user");
  const [{ loading: categoryGroupsLoading, data: categoryGroupsData, error: categoryGroupsError }] =
    useAxios("/categorygroups");
  const [{ loading: configLoading, data: configData, error: configError }] = useAxios("/config");

  // adding auto-assign button and function for testing purposes
  const autoAssign = async () => {
    const judgeId = prompt("Enter judge ID to auto-assign", "");
    if (judgeId === null || judgeId === "") {
      return;
    }
    const hide = message.loading("Loading...", 0);
    try {
      const response = await axios.post("/assignments/autoAssign", { judge: parseInt(judgeId) });
      console.log("New Assignment: ", response.data);
      hide();
      refetchUsers();
      message.info("There are no more projects available for this user to judge", 3);
    } catch (err: any) {
      hide();
      handleAxiosError(err);
    }
  };

  if (projectsLoading || userLoading || categoryGroupsLoading || configLoading) {
    return <LoadingDisplay />;
  }

  if (projectsError || userError || categoryGroupsError || configError) {
    return <ErrorDisplay error={projectsError} />;
  }

  const projects = projectData.map((project: Project) => (
    <JudgingBox key={project.id} project={project} refetch={refetchProjects} />
  ));

  const judges = userData
    .filter((user: User) => user.isJudging)
    .sort((a: Assignment, b: Assignment) => (a.priority > b.priority ? 1 : -1));

  const categoryGroups = [...categoryGroupsData, { name: "Unassigned", id: null }];

  return (
    <>
      {configData.isJudgingOn ? (
        <Alert
          message="Judging is currently enabled. This means that when judges complete a project, they will automatically be assigned a new project."
          type="info"
          showIcon
        />
      ) : (
        <Alert
          message="Judging is not currently enabled. This means that judges will not automatically be assigned new projects and auto assign will not work."
          type="warning"
          showIcon
        />
      )}
      <Title level={2}>Epicenter</Title>
      <div id="judging">{projects}</div>
      <Button
        type="primary"
        htmlType="submit"
        onClick={autoAssign}
        style={{ marginBottom: "15px", marginTop: "10px" }}
      >
        Auto-assign
      </Button>
      {categoryGroups.map((categoryGroup: any) => (
        <>
          <Title level={4}>{categoryGroup.name}</Title>
          <List
            grid={{ gutter: 16, column: 4 }}
            loading={projectsLoading}
            dataSource={judges.filter((judge: any) => judge.categoryGroupId === categoryGroup.id)}
            renderItem={(user: User) => (
              <List.Item>
                <JudgeCard key={user.id} user={user} />
              </List.Item>
            )}
          />
        </>
      ))}
      <Title level={2} style={{ textAlign: "center" }}>
        Dashboard
      </Title>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Overview" key="1">
          <ProjectTableContainer
            projects={projectData}
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

export default Epicenter;
