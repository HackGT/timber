import React from "react";
import { Card, Tag, Button } from "antd";

import { Project } from "../../types/Project";
import { Category } from "../../types/Category";
import { User } from "../../types/User";
import { TableGroup } from "../../types/TableGroup";

interface Props {
  key: number;
  project: Project;
  user?: User;
  tableGroup: TableGroup | undefined;
  onClick?: (data: any) => any;
}

const ProjectCard: React.FC<Props> = props => {
  const tags = props.project.categories.map((category: Category) => category.name);

  return (
    <Card
      key={props.key}
      title={
        <span style={{ wordBreak: "break-word", whiteSpace: "normal" }}>{props.project.name}</span>
      }
      extra={props.user && props.user.roles.admin && <Button onClick={props.onClick}>Edit</Button>}
    >
      <p>Table Group: {props.tableGroup !== undefined ? props.tableGroup.name : 1}</p>
      <p>Table Number: {props.project.table}</p>
      <p>Expo: #{props.project.expo}</p>
      <a href={props.project.devpostUrl}>View Devpost</a>
      {props.project.roomUrl && (
        <p>
          <a href={props.project.roomUrl} target="_blank" rel="noreferrer">
            Join Video Call
          </a>
        </p>
      )}
      {tags.map((tag: string) => (
        <Tag>{tag}</Tag>
      ))}
    </Card>
  );
};

export default ProjectCard;
