import React from "react";
import useAxios from "axios-hooks";
import { List, Typography } from "antd";

import JudgingBox from "./JudgingBox";
import { Project } from "../../types/Project";
import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";
import { Assignment } from "../../types/Assignment";
import JudgeCard from "./JudgeCard";
import { User } from "../../types/User";

const { Title } = Typography;

const Epicenter: React.FC = () => {
  const [{ loading: projectsLoading, data: projectData, error: projectsError }] = useAxios(
    "/projects"
  );
  const [
    { loading: assignmentsLoading, data: assignmentsData, error: assignmentsError },
  ] = useAxios("/assignments");
  const [{ loading: userLoading, data: userData, error: userError }] = useAxios("/user");

  if (projectsLoading || assignmentsLoading || userLoading) {
    return <LoadingDisplay />;
  }

  if (projectsError || assignmentsError || userError) {
    return <ErrorDisplay error={projectsError} />;
  }

  console.log(projectData);

  const projects = projectData.map((project: Project) => (
    <JudgingBox key={project.id} project={project} assignments={[]} />
  ));

  const judges = userData
    .filter((user: User) => user.isJudging)
    .sort((a: Assignment, b: Assignment) => (a.priority > b.priority ? 1 : -1));

  return (
    <>
      <Title level={2}>Epicenter</Title>
      <div id="judging">{projects}</div>

      <List
        grid={{ gutter: 16, column: 4 }}
        loading={projectsLoading}
        dataSource={judges}
        renderItem={(user: User) => (
          <List.Item>
            <JudgeCard key={user.id} user={user} />
          </List.Item>
        )}
      />
    </>
  );
};

export default Epicenter;
