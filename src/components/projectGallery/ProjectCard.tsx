import React from "react";
import { Card, Tag, Button } from "antd";

import { Project } from "../../types/Project";
import { User } from "../../types/User";
import { TableGroup } from "../../types/TableGroup";
import { HStack, Stack, Tooltip } from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";

interface Props {
  key: number;
  project: any;
  user?: User;
  isWinner: boolean;
  winnerInfo: Map<any, any>;
  onClick?: (data: any) => any;
}

const ProjectCard: React.FC<Props> = props => {
  const colors = {
    FIRST: "gold",
    SECOND: "#C0C0C0",
    THIRD: "#cd7f32",
    EMERGING: "purple",
  };

  const projectData = props.isWinner ? props.winnerInfo.get(props.project.id) : {};

  return (
    <Card
      key={props.key}
      title={
        props.isWinner ? (
          <>
            <HStack>
              <span
                style={{
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                  display: "block",
                  fontWeight: "bold",
                }}
              >
                Winner
              </span>
              <Tag color={colors[projectData.rank as keyof typeof colors]}>{projectData.rank}</Tag>
              <Tooltip
                label={
                  <Stack>
                    <div>
                      <strong>Category: </strong>
                      <Tag color="blue">{projectData.category.name}</Tag>
                    </div>
                    <div>
                      <strong>Members: </strong>
                      <div>
                        {projectData.members.map((member: any) => (
                          <li key={member.id}>{member.name}</li>
                        ))}
                      </div>
                    </div>
                  </Stack>
                }
                padding={3}
              >
                <InfoIcon />
              </Tooltip>
            </HStack>
            <span style={{ wordBreak: "break-word", whiteSpace: "normal" }}>
              {props.project.name}
            </span>
          </>
        ) : (
          <span style={{ wordBreak: "break-word", whiteSpace: "normal" }}>
            {props.project.name}
          </span>
        )
      }
      headStyle={props.isWinner ? { backgroundColor: "#ebb521" } : {}}
      extra={props.user && props.user.roles.admin && <Button onClick={props.onClick}>Edit</Button>}
      size="small"
    >
      <strong>Expo</strong>
      <p>#{props.project.expo}</p>
      <strong>Location</strong>
      <p>
        {props.project.tableGroup !== undefined ? props.project.tableGroup.name : "Unknown"}, Table
        #{props.project.table}
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
        {props.project.categories.map((category: any) => (
          <Tag style={{ marginBottom: "2px", marginRight: "4px" }}>{category.name}</Tag>
        ))}
      </p>
      <p>
        <a href={props.project.devpostUrl}>View Devpost</a>
      </p>
    </Card>
  );
};

export default ProjectCard;
