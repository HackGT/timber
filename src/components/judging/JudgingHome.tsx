import useAxios from "axios-hooks";
import React from "react";
import { apiUrl, Service } from "@hex-labs/core";
import { useDisclosure, Box, Button, Heading, Link, HStack } from "@chakra-ui/react";

import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";
import JudgingCardsContainer from "./JudgingCardsContainer";
import { User } from "../../types/User";
import { Assignment } from "../../types/Assignment";
import { Project } from "../../types/Project";
import { useCurrentHexathon } from "../../contexts/CurrentHexathonContext";
import { SkippedModal } from "./SkippedModal";
import JudgingTimer from "./JudgingTimer";

interface Props {
  user: User;
}

const JudgingHome: React.FC<Props> = props => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentHexathon } = useCurrentHexathon();

  const [{ data, loading, error }] = useAxios(apiUrl(Service.EXPO, "/assignments/current-project"));

  const [{ loading: assignmentsLoad, data: assignmentsData, error: assignmentError }] = useAxios({
    method: "GET",
    url: apiUrl(Service.EXPO, "/assignments"),
    params: {
      hexathon: currentHexathon?.id,
    },
  });

  const [{ loading: tableGroupsLoading, data: tableGroupsData, error: tableGroupsError }] =
    useAxios({
      method: "GET",
      url: apiUrl(Service.EXPO, "/table-groups"),
      params: {
        hexathon: currentHexathon?.id,
      },
    });

  const [{ loading: projectsLoading, data: projectsData, error: projectsError }] = useAxios({
    method: "GET",
    url: apiUrl(Service.EXPO, "/projects"),
    params: {
      hexathon: currentHexathon?.id,
    },
  });

  if (!props.user.categoryGroups.filter(categoryGroup => categoryGroup.id === currentHexathon?.id)) {
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

  const skippedAssignments = assignmentsData.filter(
    (assignment: Assignment) =>
      assignment.status === "SKIPPED" && assignment.userId === +props.user.id
  );

  let skippedProjects = projectsData.filter((project: any) =>
    skippedAssignments.some((skippedProject: any) => skippedProject.projectId === project.id)
  );

  skippedProjects = skippedProjects.map((proj: Project) => ({
    ...proj,
    assignmentId: skippedAssignments.find(
      (skippedProject: any) => skippedProject.projectId === proj.id
    ).id,
  }));

  if (data.length === 0) {
    return (
      <Box>
        {skippedProjects.length > 0 && (
          <Button onClick={onOpen} colorScheme="purple">
            View Skipped
          </Button>
        )}
        <SkippedModal isOpen={isOpen} onClose={onClose} projects={skippedProjects} />
        <p>You have no projects queued!</p>
      </Box>
    );
  }
  let tableGroupName = "";
  let nextTableNumber = "";

  const assignments = assignmentsData
    .filter((assignment: Assignment) => +props.user.id === assignment.userId)
    .sort((a: Assignment, b: Assignment) => (a.priority > b.priority ? 1 : -1));

  let nextProjectID = 0;

  for (const assignment of assignments) {
    if (assignment.status === "QUEUED" && assignment.projectId !== data.id) {
      nextProjectID = assignment.projectId;
      break;
    }
  }
  let nextTableGroupId = 0;
  let nextProjectName = "";
  if (nextProjectID) {
    for (const project of projectsData) {
      if (nextProjectID === project.id) {
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
      <Box display="flex" justifyContent="space-between">
        <Box>
          <HStack spacing={1}>
            <Heading
              as="h1"
              style={{ paddingBottom: "15px", fontSize: "35px", fontWeight: "normal" }}
            >
              Project Name: {data.name}
            </Heading>
            <JudgingTimer />
          </HStack>

          <Heading
            as="h3"
            style={{ paddingBottom: "10px", fontSize: "20px", fontWeight: "normal" }}
          >
            Table Number: {data.table}
          </Heading>
          <Heading
            as="h3"
            style={{ paddingBottom: "10px", fontSize: "20px", fontWeight: "normal" }}
          >
            Table Group: {tableGroupName}
          </Heading>
          <Link
            href={data.devpostUrl}
            target="_blank"
            rel="noreferrer"
            style={{ paddingBottom: "10px", fontSize: "15px", fontWeight: "normal" }}
          >
            Devpost Submission
          </Link>
        </Box>
        {skippedProjects.length > 0 && (
          <Box display="flex">
            <Button onClick={onOpen} padding="8px" colorScheme="purple">
              View Skipped
            </Button>
            <SkippedModal isOpen={isOpen} onClose={onClose} projects={skippedProjects} />
          </Box>
        )}
      </Box>
      <JudgingCardsContainer data={[data, next]} />
    </>
  );
};

export default JudgingHome;
