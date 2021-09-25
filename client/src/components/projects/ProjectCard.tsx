import React from "react";
import { Card, Tag } from "antd";

import { Project } from "../../types/Project";

interface Props {
  project: Project;
}

const ProjectCard: React.FC<Props> = props => (
  <>
    <Card title={props.project.name}>
      <p>Expo: #{props.project.expo}</p>
      <p>Table: {props.project.table}</p>
      <Tag>Project Category</Tag>
    </Card>
  </>
);

export default ProjectCard;
