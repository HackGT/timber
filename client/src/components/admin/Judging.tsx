import React from "react";
import useAxios from "axios-hooks";

import JudgingBox from "./JudgingBox";
import { Project } from "../../types/Project";
import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";

const Judging: React.FC = () => {
  const [{ loading, data, error }] = useAxios("/projects");

  if (loading) {
    return <LoadingDisplay />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  const projects = data.map((project: Project) => (
    <JudgingBox key={project.id} project={project} />
  ));

  return <div id="judging">{projects}</div>;
};

export default Judging;
