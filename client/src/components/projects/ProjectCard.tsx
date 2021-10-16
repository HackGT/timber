import React from "react";
import { Card, Tag } from "antd";

import { Project } from "../../types/Project";
import { Category } from "../../types/Category";

interface Props {
  key: number;
  project: Project;
}


const ProjectCard: React.FC<Props> = props => {
  const tags = props.project.categories.map((category: Category) => category.name);

  return (
    <>
      {console.log(props)}
      {/* {console.log(project.id)} */}
      <Card key={props.key} title={props.project.name}>
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
