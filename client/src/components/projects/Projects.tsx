import React from "react";
import useAxios from "axios-hooks";
import { List, Typography } from "antd";

import { Project } from "../../types/Project";
import ProjectCard from "./ProjectCard";
import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";

const { Title } = Typography;

const Projects: React.FC = () => {
  const [{ loading, data, error }] = useAxios("/projects");

  if (loading) {
    return <LoadingDisplay />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <>
      <Title level={2}>Projects</Title>
      <List
        grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 4 }}
        loading={loading}
        dataSource={data}
        renderItem={(project: Project) => (
          <List.Item>
            <ProjectCard key={project.id} project={project} />
          </List.Item>
        )}
      />
    </>
  );
};

export default Projects;
