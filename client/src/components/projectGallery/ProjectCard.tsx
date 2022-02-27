import React from "react";
import { Card, Tag, Button } from "antd";

import { Project } from "../../types/Project";
import { Category } from "../../types/Category";
import { User } from "../../types/User";
import { UserRole } from "../../types/UserRole";
import { TableGroup } from "../../types/TableGroup";
import useAxios from "axios-hooks";
import LoadingDisplay from "../../displays/LoadingDisplay";
import ErrorDisplay from "../../displays/ErrorDisplay";

interface Props {
  key: number;
  project: Project;
  user?: User;
  onClick?: (data: any) => any;
}

const ProjectCard: React.FC<Props> = props => {
  const [{ loading: tablegroupsLoading, data: tablegroupData, error: tablegroupsError }] = useAxios(
    `/tablegroups/${props.project.tableGroupId}`
  );

  if (tablegroupsLoading) {
    return <LoadingDisplay />;
  }

  if (tablegroupsError) {
    return <ErrorDisplay error={tablegroupsError} />;
  }
  const tags = props.project.categories.map((category: Category) => category.name);

  console.log(tablegroupData);
  return (
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
      <p>TableGroup Name: {tablegroupData.name}</p>
      <p>Table Number: {props.project.table}</p>
      <p>TableGroup Color: {tablegroupData.color}</p>
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
