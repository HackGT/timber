import React from "react";
import { useParams } from "react-router-dom";
import useAxios from "axios-hooks";
import { List, Typography } from "antd";

import LoadingDisplay from "../../displays/LoadingDisplay";
import ErrorDisplay from "../../displays/ErrorDisplay";
import ProjectCard from "../projectGallery/ProjectCard";
import { Project } from "../../types/Project";
import ProjectTableContainer from "../projectStatus/ProjectTableContainer";

const { Title } = Typography;

const CategoryGroup: React.FC = () => {
  const { categoryGroupId } = useParams<any>();
  const [{ data, loading, error }] = useAxios(
    `/projects/special/category-group/${categoryGroupId}`
  );
  const [{ data: categoryGroup, loading: categoryGroupLoading, error: categoryGroupError }] =
    useAxios(`/categorygroups/${categoryGroupId}`);

  if (loading || categoryGroupLoading) {
    return <LoadingDisplay />;
  }

  if (error || categoryGroupError) {
    return <ErrorDisplay error={error} />;
  }
  console.log(categoryGroup);

  return (
    <>
      <Title>{categoryGroup.name}</Title>

      <Title level={2}>Projects</Title>
      <List
        grid={{ gutter: 8, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 4 }}
        loading={loading}
        dataSource={data}
        renderItem={(project: Project) => (
          <List.Item>
            <ProjectCard key={project.id} project={project} />
          </List.Item>
        )}
      />
      {/* <Title level={2}> Scores </Title> */}
      {/* <ProjectTableContainer projects={data} isSponsor /> */}
    </>
  );
};
export default CategoryGroup;
