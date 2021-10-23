import React, { useState } from "react";
import useAxios from "axios-hooks";
import { Typography, List, Tabs, Button } from "antd";
import axios from "axios";

import JudgingBox from "./JudgingBox";
import { Project } from "../../types/Project";
import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";
import { Assignment } from "../../types/Assignment";
import JudgeCard from "./JudgeCard";
import { User } from "../../types/User";
import Dashboard from "./Dashboard";
import Ranking from "./Ranking";
import JudgeAssignmentModal from "./JudgeAssignmentModal";

const { Title } = Typography;
const { TabPane } = Tabs;

const Epicenter: React.FC = () => {
  const [{ loading: projectsLoading, data: projectData, error: projectsError }, refetch] =
    useAxios("/projects");
  const [{ loading: userLoading, data: userData, error: userError }] = useAxios("/user");
  const [{ loading: categoryGroupsLoading, data: categoryGroupsData, error: categoryGroupsError }] =
    useAxios("/categorygroups");

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // adding auto-assign button and function for testing purposes
  const autoAssign = () => {
    const judgeId = prompt("Enter judge ID to auto-assign", "");
    if (judgeId === null || judgeId === "") {
      return;
    }

    axios.post("/assignments/autoAssign", { judge: parseInt(judgeId) }).then(assignment => {
      console.log(assignment);
    });
  };

  if (projectsLoading || userLoading || categoryGroupsLoading) {
    return <LoadingDisplay />;
  }

  if (projectsError || userError || categoryGroupsError) {
    return <ErrorDisplay error={projectsError} />;
  }

  const projects = projectData.map((project: Project) => (
    <JudgingBox key={project.id} project={project} refetch={refetch} />
  ));

  const judges = userData
    .filter((user: User) => user.isJudging)
    .sort((a: Assignment, b: Assignment) => (a.priority > b.priority ? 1 : -1));

  const categoryGroups = [...categoryGroupsData, { name: "Unassigned", id: null }];

  return (
    <>
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
      <Button onClick={showModal}>Manually Assign</Button>
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
      <JudgeAssignmentModal visible={isModalVisible} handleCancel={handleCancel} />
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
