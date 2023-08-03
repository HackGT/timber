import React from "react";
import { Card, Tag, Button } from "antd";

import { Project } from "../../types/Project";
import { User } from "../../types/User";
import { TableGroup } from "../../types/TableGroup";

interface Props {
  key: number;
  project: Project;
  user?: User;
  tableGroup: TableGroup | undefined;
  onClick?: (data: any) => any;
}

const ProjectCard: React.FC<Props> = props => (
  <Card
    key={props.key}
    title={
      <span style={{ wordBreak: "break-word", whiteSpace: "normal" }}>{props.project.name}</span>
    }
    extra={props.user && props.user.roles.admin && <Button onClick={props.onClick}>Edit</Button>}
    size="small"
  >
    <strong>Expo</strong>
    <p>#{props.project.expo}</p>
    <strong>Location</strong>
    <p>
      {props.tableGroup !== undefined ? props.tableGroup.name : "Unknown"}, Table #
      {props.project.table}
    </p>
    {props.project.roomUrl && (
      <p>
        <a href={props.project.roomUrl} target="_blank" rel="noreferrer">
          Join Video Call
        </a>
      </p>
    )}
    <strong>Categories</strong>
    <p>
      {props.project.categories.map(category => (
        <Tag style={{ marginBottom: "2px", marginRight: "4px" }}>{category.name}</Tag>
      ))}
    </p>
    <p>
      <a href={props.project.devpostUrl}>View Devpost</a>
    </p>
  </Card>
);

export default ProjectCard;
