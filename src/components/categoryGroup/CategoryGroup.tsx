import React from "react";
import { useParams } from "react-router-dom";
import useAxios from "axios-hooks";
import { List, Typography } from "antd";
import { apiUrl, Service } from "@hex-labs/core";

import LoadingDisplay from "../../displays/LoadingDisplay";
import ErrorDisplay from "../../displays/ErrorDisplay";
import ProjectCard from "../projectGallery/ProjectCard";
import { Project } from "../../types/Project";
import CategoryGroupProjectTableContainer from "./CategoryGroupProjectTableContainer";

const { Title } = Typography;

const CategoryGroup: React.FC = () => {
  const { categoryGroupId } = useParams<any>();
  const [{ data, loading, error }] = useAxios(
    apiUrl(Service.EXPO, `/projects/special/category-group/${categoryGroupId}`)
  );
  const [{ data: categoryGroup, loading: categoryGroupLoading, error: categoryGroupError }] =
    useAxios(apiUrl(Service.EXPO, `/categorygroups/${categoryGroupId}`));

  if (loading || categoryGroupLoading) {
    return <LoadingDisplay />;
  }

  if (error || categoryGroupError) {
    return <ErrorDisplay error={error} />;
  }

  const categoryIds = categoryGroup.categories.map((category: any) => category.id);

  return (
    <>
      <Title>{categoryGroup.name}</Title>

      <Title level={2}>Projects</Title>
      <List
        grid={{ gutter: 8, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 4 }}
        loading={loading}
        dataSource={data}
      />
      <Title level={2}> Scores </Title>
      <CategoryGroupProjectTableContainer projects={data} categoryIds={categoryIds} isSponsor />
    </>
  );
};
export default CategoryGroup;
