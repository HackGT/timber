import React from "react";
import { Card } from "antd";

import JudgingBox from "./JudgingBox";
import { User } from "../../types/User";
import PlaceHolderBox from "./PlaceholderBox";
import { Assignment } from "../../types/Assignment";

interface Props {
  key: string;
  user: User;
}

const JudgeCard: React.FC<Props> = props => {
  const projects = props.user.assignments.map((assignment: Assignment) => (
    <JudgingBox key={assignment.id} project={assignment.project} assignment={assignment} />
  ));

  projects.splice(1, 0, <PlaceHolderBox />);

  return (
    <>
      <Card key={props.key} title={`${props.user.id} - ${props.user.name}`} size="small">
        <div id="judging">{projects}</div>
      </Card>
    </>
  );
};

export default JudgeCard;
