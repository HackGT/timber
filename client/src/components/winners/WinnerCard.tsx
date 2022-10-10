import React from "react";
import { Card, Tag } from "antd";

import { Project } from "../../types/Project";
import { User } from "../../types/User";
import { Category } from "../../types/Category";
import { Hackathon } from "../../types/Hackathon";

interface Props {
  id: number;
  project: Project;
  category: Category;
  members: User[];
  hackathon: Hackathon;
  rank: string;
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
    >
      <p>
        <b>Hexathon:</b> {props.hackathon.name}
      </p>
      <p>
        <b>Rank:</b> <Tag color={rankColor}>{props.rank}</Tag>
      </p>
      <p>
        <b>Category:</b> <Tag color="blue">{props.category.name}</Tag>
      </p>
      <b>Members</b>
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
