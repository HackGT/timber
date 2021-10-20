import React from "react";
import { Card } from "antd";

import JudgingBox from "./JudgingBox";
import { Project } from "../../types/Project";
import { User } from "../../types/User";
import PlaceHolderBox from "./PlaceholderBox";

interface Props {
  key: string;
  user: User;
}

const JudgeCard: React.FC<Props> = props => {
  const projects = props.user.projects.map((project: Project) => (
    <JudgingBox key={project.id} project={project} assignments={props.user.assignments} />
  ));

  projects.splice(1, 0, <PlaceHolderBox />);

  return (
    <>
      <Card key={props.key} title={props.user.name}>
        <div id="judging">{projects}</div>
      </Card>
    </>
  );
};

export default JudgeCard;
