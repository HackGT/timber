import { Typography } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, 
         Box, Button, Tag, TagLabel, Text } from '@chakra-ui/react';

import { Ballot } from "../../types/Ballot";
import { Category } from "../../types/Category";
import { Project } from "../../types/Project";

const { Title } = Typography;

interface Props {
  projects: Project[];
}

interface ScoreData {
  [categoryName: string]: {
    [userName: string]: number;
  };
}

const AllProjectBoxes: React.FC<Props> = ({ projects }) => {
  console.log("here");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // const paginatedProjects = useMemo(() => {
  //   const startIndex = (currentPage - 1) * itemsPerPage;
  //   const endIndex = startIndex + itemsPerPage;
  //   return projects.slice(startIndex, endIndex);
  // }, [projects, currentPage]);

  const [scoreData, setScoreData] = useState<Record<number, ScoreData>>({});
  // const scoreData = useMemo(() => {
  //   const totalScore: Record<number, ScoreData> = {};
  //   console.log("here1");
  //   projects.forEach((project: Project) => {
  //     const projectScoreData: ScoreData = {};
  //     project.categories.forEach((category: Category) => {
  //       projectScoreData[category.name] = {};
  //       project.ballots.forEach((ballot: Ballot) => {
  //         if (ballot.criteria.categoryId === category.id) {
  //           projectScoreData[category.name][ballot.user.name] =
  //             (projectScoreData[category.name][ballot.user.name] || 0) + ballot.score;
  //         }
  //       });
  //       totalScore[project.id] = projectScoreData;
  //     });
  //   });
  //   return totalScore;
  // }, []);
  console.log("Here2");

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  }

  const tagExpoColors = {
    1: "blue",
    2: "cyan",
  };
  const tagRoundColors = {
    1: "red",
    2: "orange",
  };
  return (
    <>
      <Accordion w="90%" overflow="auto" maxHeight="400px" border="1px solid #ccc" borderRadius="4px">
        {projects.map((project: Project) => (
          <AccordionItem key={project.id}>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1"  w="300px" textAlign="left">
                  {project.name} {" "}
                  <Tag size='sm' colorScheme={tagExpoColors[project.expo as keyof typeof tagExpoColors]} borderRadius='full'>
                    <TagLabel>Expo: {project.expo}</TagLabel>
                  </Tag> {" "}
                  <Tag size='sm' colorScheme={tagRoundColors[project.expo as keyof typeof tagRoundColors]} borderRadius='full'>
                    <TagLabel>Round: {project.round}</TagLabel>
                  </Tag> {" "}
                  <Tag size='sm' borderRadius='full'>
                    <TagLabel>Table: {`${project.tableGroup !== undefined ? project.tableGroup.shortCode : 1} ${project.table}`}</TagLabel>
                  </Tag>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Box flexDirection="column">
                <Title level={5}>{project.name}</Title>
                <a href={project.devpostUrl} target="_blank" rel="noreferrer">{project.devpostUrl}</a>
                <Text>Table Group: {project.tableGroup !== undefined ? project.tableGroup.name : "N/A"}</Text>
                <Text>Table Number: {project.table}</Text>
                <Text as="b">Category Scores</Text>
                {Object.entries(scoreData[project.id] || {}).map(([categoryName, scores]) => {
                  const scoreString = Object.values(scores).join(", ");
                  return <div><Tag><TagLabel>{categoryName}</TagLabel></Tag> {`${scoreString !== "" ? scoreString : "0"}`}</div>
                })}
                {project.roomUrl && (
                  <a href={project.roomUrl} target="_blank" rel="noreferrer">
                    Join Video Call
                  </a>
                )}
              </Box>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
      {/* <div>
        {Array.from({ length: Math.ceil(projects.length / itemsPerPage) }, (_, i) => (
            <Button key={i} onClick={() => handlePageChange(i + 1)}>
              {i + 1}
            </Button>
        ))}
      </div> */}
    </>
  )
}

export default AllProjectBoxes;