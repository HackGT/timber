import { TableColumnGroupType } from "antd";
import useAxios from "axios-hooks";
import React from "react";

import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";
import DailyWindow from "../video/DailyWindow";
import JudgingCardsContainer from "./JudgingCardsContainer";
import { TableGroup } from "../../types/TableGroup";
import { User } from "../../types/User";
import { Assignment } from "../../types/Assignment";
import { apiUrl, Service } from "@hex-labs/core";
import { useCurrentHexathon } from "../../contexts/CurrentHexathonContext";

interface Props {
  user: User;
}

const JudgingHome: React.FC<Props> = props => {
  const CurrentHexathonContext = useCurrentHexathon();
  const { currentHexathon } = CurrentHexathonContext;

  const [{ data, loading, error }] = useAxios(apiUrl(Service.EXPO, "/assignments/current-project"));

  const [{ loading: assignmentsLoad, data: assignmentsData, error: assignmentError }] = useAxios({
    method: "GET",
    url: apiUrl(Service.EXPO, "/assignments"),
    params: {
      hexathon: currentHexathon.id
    },
  });

  const [{ loading: tableGroupsLoading, data: tableGroupsData, error: tableGroupsError }] = useAxios({
    method: "GET",
    url: apiUrl(Service.EXPO, "/tablegroups"),
    params: {
      hexathon: currentHexathon.id
    },
  });

  const [{ loading: projectsLoading, data: projectsData, error: projectsError }, refetchProjects] = useAxios({
    method: "GET",
    url: apiUrl(Service.EXPO, "/projects"),
    params: {
      hexathon: currentHexathon.id
    },
  });

  if (!props.user.categoryGroupId) {
    return (
      <p>
        Please ask a HexLabs team member to assign you a category group before you start judging.
      </p>
    );
  }

  if (loading || assignmentsLoad || tableGroupsLoading || projectsLoading) {
    return <LoadingDisplay />;
  }

  if (error || assignmentError || tableGroupsError || projectsError) {
    return <ErrorDisplay error={error} />;
  }

  if (data.length === 0) {
    return <p>You have no projects queued!</p>;
  }
  let tableGroupName = "";
  let nextTableNumber = "";

  const assignments = assignmentsData
    .filter((assignment: Assignment) => +props.user.id === assignment.userId)
    .sort((a: Assignment, b: Assignment) => (a.priority > b.priority ? 1 : -1));

  let nextProjectID = 0;

  for (const assignment of assignments) {
    if (assignment.status === "QUEUED" && assignment.projectId != data.id) {
      nextProjectID = assignment.projectId;
      break;
    }
  }
  let nextTableGroupId = 0;
  let nextProjectName = "";
  if (nextProjectID) {
    for (const project of projectsData) {
      if (nextProjectID == project.id) {
        nextTableNumber = project.table;
        nextTableGroupId = project.tableGroupId;
        nextProjectName = project.name;
      }
    }
  }

  let nextTableGroupName = "";
  for (const tableGroup of tableGroupsData) {
    if (tableGroup.id === data.tableGroupId) {
      tableGroupName = tableGroup.name;
    }
    if (tableGroup.id === nextTableGroupId) {
      nextTableGroupName = tableGroup.name;
    }
  }

  let next;
  if (nextProjectID) {
    next = (
      <h3>
        The next project is {nextProjectName} at table number: {nextTableNumber} in table group:{" "}
        {nextTableGroupName}.
      </h3>
    );
  } else {
    next = <h3>You have no projects up next!</h3>;
  }

  return (
    <>
      <h1>Project Name: {data.name}</h1>
      <h3>Table Number: {data.table} </h3>
      <h3>Table Group: {tableGroupName}</h3>

      <a href={data.devpostUrl} target="_blank" rel="noreferrer">
        Devpost Submission
      </a>
      {/* <DailyWindow videoUrl={data.roomUrl} /> */}
      <JudgingCardsContainer data={[data, next]} />

      {/* <div style={{ marginTop: "5px" }}>{next}</div> */}
    </>
  );
};

export default JudgingHome;
