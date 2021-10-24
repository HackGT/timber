import React, { useState } from "react";
import useAxios from "axios-hooks";
import { Typography, List, Tabs, Button, Alert, message } from "antd";
import axios from "axios";

import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";
import { Assignment } from "../../types/Assignment";
import JudgeCard from "./JudgeCard";
import { User } from "../../types/User";
import Dashboard from "./Dashboard";
import Ranking from "./Ranking";
import { handleAxiosError } from "../../util/util";
import JudgeAssignmentModal from "./JudgeAssignmentModal";
import EpicenterProjectBoxes from "./EpicenterProjectBoxes";

const { Title } = Typography;
const { TabPane } = Tabs;

const Epicenter: React.FC = () => {
  const [{ loading: userLoading, data: userData, error: userError }, refetchUsers] =
    useAxios("/user");
  const [{ loading: categoryGroupsLoading, data: categoryGroupsData, error: categoryGroupsError }] =
    useAxios("/categorygroups");
  const [{ loading: configLoading, data: configData, error: configError }] = useAxios("/config");
  const [judgingModalOpen, setJudgingModalOpen] = useState(false);

  const handleJudgingModalOpen = () => {
    setJudgingModalOpen(true);
  };

  const handleCancel = () => {
    setJudgingModalOpen(false);
  };

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

  if (userLoading || categoryGroupsLoading || configLoading) {
    return <LoadingDisplay />;
  }

  if (userError || categoryGroupsError || configError) {
    return <ErrorDisplay error={userError} />;
  }

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
      <EpicenterProjectBoxes />
      <Button
        type="primary"
        htmlType="submit"
        onClick={autoAssign}
        style={{ margin: "10px 10px 15px 0" }}
      >
        Auto-assign
      </Button>
      <Button onClick={handleJudgingModalOpen} style={{ margin: "10px 0 15px 0" }}>
        Manual Assign
      </Button>
      <JudgeAssignmentModal visible={judgingModalOpen} handleCancel={handleCancel} />
      {categoryGroups.map((categoryGroup: any) => (
        <>
          <Title level={4}>{categoryGroup.name}</Title>
          <List
            grid={{ gutter: 16, column: 4 }}
            loading={categoryGroupsLoading}
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
