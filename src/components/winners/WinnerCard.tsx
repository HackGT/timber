import React from "react";
import { Button, Card, Tag } from "antd";

import { Project } from "../../types/Project";
import { User } from "../../types/User";
import { Category } from "../../types/Category";

interface Props {
  id: number;
  project: Project;
  category: Category;
  members: User[];
  rank: string;
  visible: boolean;
  onClick?: (data: any) => any;
}

const WinnerCard: React.FC<Props> = props => {
  const colors = {
    FIRST: "gold",
    SECOND: "#C0C0C0",
    THIRD: "#cd7f32",
    GENERAL: "purple",
  };

  const rankColor = colors[props.rank as keyof typeof colors];

  return (
    <Card
      key={props.id}
      title={
        <span style={{ wordBreak: "break-word", whiteSpace: "normal" }}>{props.project.name}</span>
      }
      extra={props.visible ? <Button onClick={props.onClick}>Edit</Button> : <></>}
    >
      <p>
        <b>Rank:</b> <Tag color={rankColor}>{props.rank}</Tag>
      </p>
      <p>
        <b>Category:</b> <Tag color="blue">{props.category.name}</Tag>
      </p>
      <b>Members:</b>
      <p>
        {props.members.map(member => (
          <li key={member.id}>
            {member.name} - {member.email}
          </li>
        ))}
      </p>
    </Card>
  );
};

export default WinnerCard;
