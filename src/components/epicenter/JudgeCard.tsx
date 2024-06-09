import React from "react";
import { Card } from "antd";

import JudgingBox from "./JudgingBox";
import { User } from "../../types/User";
import { Assignment } from "../../types/Assignment";
import { AssignmentStatus } from "../../types/AssignmentStatus";
import { TableGroup } from "../../types/TableGroup";
import { useCurrentHexathon } from "../../contexts/CurrentHexathonContext";
import { Accordion, Text, Box, Stack } from "@chakra-ui/react";

interface Props {
  key: string;
  user: User;
  tableGroup: any;
}

const JudgeCard: React.FC<Props> = props => {
  const CurrentHexathonContext = useCurrentHexathon();
  const { currentHexathon } = CurrentHexathonContext;
  const queuedProjects: any[] = [];
  const completedProjects: any[] = [];

  props.user.assignments.forEach((assignment: Assignment) => {
    if (assignment.project.hexathon !== currentHexathon?.id) return;
    switch (assignment.status) {
      case AssignmentStatus.QUEUED:
        queuedProjects.push(
          <JudgingBox
            key={assignment.id}
            project={assignment.project}
            assignment={assignment}
            tableGroup={assignment.project.tableGroup}
          />
        );
        break;
      case AssignmentStatus.COMPLETED:
      case AssignmentStatus.SKIPPED:
        completedProjects.push(
          <JudgingBox
            key={assignment.id}
            project={assignment.project}
            assignment={assignment}
            tableGroup={props.tableGroup}
          />
        );
        break;
    }
  });

  return (
    <Card key={props.key} title={`${props.user.id} - ${props.user.name}`} size="small">
      <div id="judging"><Text>Queued: </Text><br /> <Accordion allowMultiple>{queuedProjects}</Accordion></div>
      <Box id="judging" gap={4} display='block'>
        <Text>Completed/Skipped: </Text>
        <Accordion allowMultiple>{completedProjects}</Accordion>
      </Box>
    </Card>
  );
};

export default JudgeCard;
