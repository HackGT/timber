import React from "react";
import { Card, Tag, Button } from "antd";

import { Project } from "../../types/Project";
import { Category } from "../../types/Category";
import { User } from "../../types/User";
import { UserRole } from "../../types/UserRole"

interface Props {
  key: number;
  project: Project;
  user?: User;
  onClick?: (data: any) => any;
}

const ProjectCard: React.FC<Props> = props => {
  const tags = props.project.categories.map((category: Category) => category.name);
  console.log(props.user)
  return (
    <>
      {console.log(props)}
      {/* {console.log(project.id)} */}
      <Card key={props.key} title={props.project.name} extra={props.user && [UserRole.ADMIN].includes(props.user.role) && <Button onClick={props.onClick}>Edit</Button>}>
        <p>Expo: #{props.project.expo}</p>
        <p>Table: {props.project.table}</p>
        {tags.map((tag: string) => (
          <Tag>{tag}</Tag>
        ))}
      </Card>
    </>
  );
};

export default ProjectCard;
