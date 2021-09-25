import React from "react";
import useAxios from "axios-hooks";

import JudgingBox from "./JudgingBox";
import { Project } from "../../types/Project";

const Judging: React.FC = () => {
  const [{ loading, data, error }] = useAxios("/projects");

  if (loading) {
    return <p>Loading</p>;
  }

  if (error) {
    return <p>Error</p>;
  }

  const projects = data.map((project: Project) => (
    <JudgingBox key={project.id} project={project} />
  ));

  return <div id="judging">{projects}</div>;
};

export default Judging;
