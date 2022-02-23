import React from "react";
import { Card, Tag, Button } from "antd";

import { Project } from "../../types/Project";
import { Category } from "../../types/Category";
import { User } from "../../types/User";
import { UserRole } from "../../types/UserRole";
import { TableGroup } from "../../types/TableGroup";

interface Props {
  key: number;
  project: Project;
  user?: User;
  tablegroups: TableGroup[];
  onClick?: (data: any) => any;
}

const ProjectCard: React.FC<Props> = props => {
  const tablegroup = props.tablegroups.filter((group: TableGroup) => group.id==props.project.id);
  const tags = props.project.categories.map((category: Category) => category.name);  return (
    <Card
      key={props.key}
      title={
        <span style={{ wordBreak: "break-word", whiteSpace: "normal" }}>{props.project.name}</span>
      }
      extra={
        props.user &&
        [UserRole.ADMIN].includes(props.user.role) && <Button onClick={props.onClick}>Edit</Button>
      }
    >
      <p>{tablegroup[0].name}:  {tablegroup[0].color}</p>
      <p>Expo: #{props.project.expo}</p>
      <p>
        <a href={props.project.roomUrl} target="_blank" rel="noreferrer">
          Join Video Call
        </a>
      </p>
      {tags.map((tag: string) => (
        <Tag>{tag}</Tag>
      ))}
    </Card>
  );
};

export default ProjectCard;
