import React from "react";
import useAxios from "axios-hooks";
import { List } from "antd";

import { Project } from "../../types/Project";
import ProjectCard from "./ProjectCard";

const Projects: React.FC = () => {
  const [{ loading, data, error }] = useAxios("/projects");

  if (loading) {
    return <p>Loading</p>;
  }

  if (error) {
    return <p>Error</p>;
  }

  return (
    <>
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
