import React from "react";
import useAxios from "axios-hooks";
import { Popover, Typography } from "antd";
import { Box, Flex, Text } from "@chakra-ui/react";
import { apiUrl, Service } from "@hex-labs/core";

import ErrorDisplay from "../../../../displays/ErrorDisplay";
import LoadingDisplay from "../../../../displays/LoadingDisplay";
import { Assignment } from "../../../../types/Assignment";
import { AssignmentStatus } from "../../../../types/AssignmentStatus";
import { Project } from "../../../../types/Project";
import { TableGroup } from "../../../../types/TableGroup";
import { User } from "../../../../types/User";
import { useCurrentHexathon } from "../../../../contexts/CurrentHexathonContext";

const { Title } = Typography;

type JudgeAssignment = { judge: User; status: AssignmentStatus };

const TableMap: React.FC = () => {
  const { currentHexathon } = useCurrentHexathon();
  const params = { hexathon: currentHexathon?.id };

  const [{ loading: projectsLoading, data: projectsData, error: projectsError }] = useAxios({
    url: apiUrl(Service.EXPO, "/projects"),
    params,
  });
  const [{ loading: tableGroupsLoading, data: tableGroupsData, error: tableGroupsError }] =
    useAxios({ url: apiUrl(Service.EXPO, "/table-groups"), params });
  const [{ loading: categoryGroupsLoading, data: categoryGroupsData, error: categoryGroupsError }] =
    useAxios({ url: apiUrl(Service.EXPO, "/category-groups"), params });

  if (projectsLoading || tableGroupsLoading || categoryGroupsLoading) {
    return <LoadingDisplay />;
  }
  if (projectsError || tableGroupsError || categoryGroupsError) {
    return <ErrorDisplay error={projectsError || tableGroupsError || categoryGroupsError} />;
  }

  const judgesByProject = new Map<number, Map<number, JudgeAssignment>>();
  categoryGroupsData.forEach((categoryGroup: any) =>
    categoryGroup.users?.forEach((judge: User) =>
      judge.assignments.forEach((assignment: Assignment) => {
        if (!judgesByProject.has(assignment.project.id)) {
          judgesByProject.set(assignment.project.id, new Map());
        }
        judgesByProject
          .get(assignment.project.id)!
          .set(assignment.id, { judge, status: assignment.status });
      })
    )
  );

  const renderInfo = (project: Project) => {
    const judges = Array.from(judgesByProject.get(project.id)?.values() ?? []);
    return (
      <Box maxW="260px">
        <Text fontWeight="bold">
          #{project.id} {project.name}
        </Text>
        <Text fontSize="sm">{project.members?.map(member => member.name).join(", ")}</Text>
        <Text fontSize="sm" mt={2} fontWeight="semibold">
          Judges
        </Text>
        {judges.length === 0 && <Text fontSize="sm">None</Text>}
        {judges.map(({ judge, status }) => (
          <Text key={`${judge.id}-${status}`} fontSize="sm">
            {judge.name} — {status.toLowerCase()}
          </Text>
        ))}
      </Box>
    );
  };

  return (
    <Box mt={8}>
      <Title level={3}>Table Map</Title>
      {tableGroupsData.map((tableGroup: TableGroup) => {
        const projectsByTable = new Map<number, Project>();
        projectsData
          .filter((project: Project) => project.tableGroup?.id === tableGroup.id)
          .forEach((project: Project) => projectsByTable.set(project.table, project));
        const tableCount = Math.max(tableGroup.tableCapacity, ...Array.from(projectsByTable.keys()));

        return (
          <Box key={tableGroup.id} mb={6}>
            <Title level={5}>
              {tableGroup.name} ({projectsByTable.size}/{tableGroup.tableCapacity})
            </Title>
            <Flex wrap="wrap" gap={1}>
              {Array.from({ length: tableCount }, (_, i) => i + 1).map(table => {
                const project = projectsByTable.get(table);
                const square = (
                  <Flex
                    key={table}
                    w="36px"
                    h="36px"
                    align="center"
                    justify="center"
                    fontSize="xs"
                    borderRadius="sm"
                    cursor={project ? "pointer" : "default"}
                    bg={project ? "green.400" : "white"}
                    color={project ? "white" : "gray.700"}
                  >
                    {table}
                  </Flex>
                );
                return project ? (
                  <Popover key={table} content={renderInfo(project)} title={`Table ${table}`}>
                    {square}
                  </Popover>
                ) : (
                  square
                );
              })}
            </Flex>
          </Box>
        );
      })}
    </Box>
  );
};

export default TableMap;
