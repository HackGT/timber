import React from "react";
import { useParams } from "react-router-dom";
import useAxios from "axios-hooks";
import { Space, Typography } from "antd";

import LoadingDisplay from "../../displays/LoadingDisplay";
import ErrorDisplay from "../../displays/ErrorDisplay";
import ProjectCard from "../projectGallery/ProjectCard";
import { Project } from "../../types/Project";
import ProjectTableContainer from "../epicenter/ProjectTableContainer";

const { Title } = Typography;

const CategoryGroup: React.FC = () => {
  const { categoryGroupId } = useParams<any>();
  const [{ data, loading, error }] = useAxios(
    `/projects/special/category-group/${categoryGroupId}`
  );

  if (loading) {
    return <LoadingDisplay />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <>
      <Space size="middle" direction="vertical">
        <Title level={2}>Projects Within Category Group</Title>
        {data.map((project: Project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
        <Title level={2}> Scores </Title>
        <ProjectTableContainer projects={data} isSponsor />
      </Space>
    </>
  );
};
export default CategoryGroup;
