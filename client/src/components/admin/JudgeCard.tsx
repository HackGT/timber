import React from "react";
import { Card } from "antd";

import { Project } from "../../types/Project";

interface Props {
  key: number;
  project: Project;
}

const JudgeCard: React.FC<Props> = props => {
  const x = 1;
  // Pull judges from the user routes

  return (
    <>
      <Card key={props.key} title="Judge Name">
        <p>Expo: #{props.project.expo}</p>
        <p>Table: {props.project.table}</p>
      </Card>
    </>
  );
};

export default JudgeCard;
