import React from "react";
import { useParams } from "react-router-dom";
import useAxios from "axios-hooks";

import LoadingDisplay from "../../displays/LoadingDisplay";
import ErrorDisplay from "../../displays/ErrorDisplay";
import ProjectCard from "../projects/ProjectCard";
import { Project } from "../../types/Project";

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
      <h1>Projects Within Category Group</h1>
      {data.map((project: Project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </>
  );
};
export default CategoryGroup;
