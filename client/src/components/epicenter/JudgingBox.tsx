import { Button, Popover, Tag } from "antd";
import React from "react";

import { Project } from "../../types/Project";

interface Props {
  key: number;
  project: Project;
}

const JudgingBox: React.FC<Props> = props => {
  const content = (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <p>{props.project.name}</p>
      <a href={props.project.devpostUrl} target="_blank" rel="noreferrer">
        {props.project.devpostUrl}
      </a>
      <div>
        {props.project.categories.map(category => (
          <Tag>{category.name}</Tag>
        ))}
      </div>
      <a href={props.project.devpostUrl} target="_blank" rel="noreferrer">
        Join Meeting Room
      </a>
      <p>Change Round</p>
      <div>
        <Button>Move Back 1</Button>
        <Button style={{ marginLeft: "10px" }}>Move Up 1</Button>
      </div>
    </div>
  );

  return (
    <Popover content={content} key={props.key} placement="bottom">
      <div className="judging-boxes">
        <div className="judging-box-top-row">
          <p>E:{props.project.expo}</p>
          <p>R:{props.project.round}</p>
        </div>
        <p className="judging-box-project-id">P{props.project.id}</p>
      </div>
    </Popover>
  );
};

export default JudgingBox;
