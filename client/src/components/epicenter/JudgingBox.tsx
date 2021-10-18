import React from "react";

import { Assignment } from "../../types/Assignment";
import { Project } from "../../types/Project";

interface Props {
  key: number;
  project: Project;
  assignments: Assignment[];
}

const JudgingBox: React.FC<Props> = props => {
  // Finds the assignemtn corresponding with the project
  const assignment = props.assignments.find(
    (assign: Assignment) => assign.userId === props.project.id
  );

  if (assignment !== undefined && assignment.status.toString() === "QUEUED") {
    return (
      <div className="judging-boxes" key={props.key} style={{ background: "#888888" }}>
        <div className="judging-box-top-row">
          <p>E:{props.project.expo}</p>
          <p>R:{props.project.round}</p>
        </div>
        <p className="judging-box-project-id">P{props.project.id}</p>
      </div>
    );
  }
  return (
    <div className="judging-boxes" key={props.key}>
      <div className="judging-box-top-row">
        <p>E:{props.project.expo}</p>
        <p>R:{props.project.round}</p>
      </div>
      <p className="judging-box-project-id">P{props.project.id}</p>
    </div>
  );
};

export default JudgingBox;
