import React from "react";
import { Card } from "antd";

import JudgingBox from "./JudgingBox";
import { User } from "../../types/User";
import { Assignment } from "../../types/Assignment";
import { AssignmentStatus } from "../../types/AssignmentStatus";
import { TableGroup } from "../../types/TableGroup";

interface Props {
  key: string;
  user: User;
  tableGroupMap: Map<number, TableGroup>;
}

const JudgeCard: React.FC<Props> = props => {
  const queuedProjects: any[] = [];
  const startedProjects: any[] = [];
  const completedProjects: any[] = [];

  props.user.assignments.forEach((assignment: Assignment) => {
    console.log(assignment);
    switch (assignment.status) {
      case AssignmentStatus.QUEUED:
        queuedProjects.push(
          <JudgingBox key={assignment.id} project={assignment.project} assignment={assignment} tableGroup={props.tableGroupMap.get(assignment.project.tableGroupId)}/>
        );
        break;
      case AssignmentStatus.STARTED:
        startedProjects.push(
          <JudgingBox key={assignment.id} project={assignment.project} assignment={assignment} tableGroup={props.tableGroupMap.get(assignment.project.tableGroupId)}/>
        );
        break;
      case AssignmentStatus.COMPLETED:
      case AssignmentStatus.SKIPPED:
        completedProjects.push(
          <JudgingBox key={assignment.id} project={assignment.project} assignment={assignment} tableGroup={props.tableGroupMap.get(assignment.project.tableGroupId)}/>
        );
        break;
    }
  });

  return (
    <>
      <Card key={props.key} title={`${props.user.id} - ${props.user.name}`} size="small">
        <div id="judging">Queued: {queuedProjects}</div>
        <div id="judging">Started: {startedProjects}</div>
        <div id="judging">Completed/Skipped: {completedProjects}</div>
      </Card>
    </>
  );
};

export default JudgeCard;
