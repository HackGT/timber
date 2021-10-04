import React from "react";

import { Project } from "../../types/Project";

interface Props {
  key: number;
  project: Project;
}

const JudgingBox: React.FC<Props> = props => (
  <div className="judging-boxes" key={props.key}>
    <div className="judging-box-top-row">
      <p>E:{props.project.expo}</p>
      <p>R:{props.project.round}</p>
    </div>
    <p className="judging-box-project-id">P{props.project.id}</p>
  </div>
);

export default JudgingBox;
