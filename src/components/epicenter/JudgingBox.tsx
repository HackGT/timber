import React from "react";
import { Button, Popover, Tag, Typography } from "antd";
import axios, { AxiosPromise, AxiosRequestConfig } from "axios";
import useAxios, { RefetchOptions } from "axios-hooks";
import { apiUrl, Service } from "@hex-labs/core";

import { Ballot } from "../../types/Ballot";
import { Assignment } from "../../types/Assignment";
import { Project } from "../../types/Project";
import { handleAxiosError } from "../../util/util";
import { Category } from "../../types/Category";
import { TableGroup } from "../../types/TableGroup"; // NEW CHANGE 1
import LoadingDisplay from "../../displays/LoadingDisplay";
import ErrorDisplay from "../../displays/ErrorDisplay";
import {
  Box, Text, Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Badge,
  Flex
} from "@chakra-ui/react";

const { Title } = Typography;

interface Props {
  project: Project;
  assignment?: Assignment;
  tableGroup: TableGroup | undefined;
  refetch?: (
    config?: AxiosRequestConfig | undefined,
    options?: RefetchOptions | undefined
  ) => AxiosPromise<any>;
}

const JudgingBox: React.FC<Props> = props => {

  const colorSchemeMapper: { [index: string]: any } = {
    0: "blue",
    1: "green",
    2: "purple",
  }
  const updateRound = async (difference: number) => {
    axios
      .patch(apiUrl(Service.EXPO, `/projects/${props.project.id}`), {
        round: props.project.round + difference,
      })
      .then(response => {
        props.refetch && props.refetch();
      })
      .catch(err => {
        handleAxiosError(err);
      });
  };

  const updateExpo = async (difference: number) => {
    axios
      .patch(apiUrl(Service.EXPO, `/projects/${props.project.id}`), {
        expo: props.project.expo + difference,
      })
      .then(response => {
        props.refetch && props.refetch();
      })
      .catch(err => {
        handleAxiosError(err);
      });
  };

  const scoreData: any = {};

  props.project.categories.forEach((category: Category) => {
    scoreData[category.name] = {};
    props.project.ballots.forEach((ballot: Ballot) => {
      if (ballot.criteria.categoryId === category.id) {
        scoreData[category.name][ballot.user.name] =
          (scoreData[category.name][ballot.user.name] || 0) + ballot.score;
      }
    });
  });

  const content = (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {/* <Title level={5}>{props.project.name}</Title> */}
      <a href={props.project.devpostUrl} target="_blank" rel="noreferrer">
        {props.project.devpostUrl}
      </a>
      <Text>Table Group: {props.tableGroup !== undefined ? props.tableGroup.name : "N/A"}</Text>
      <Text>Table Number: {props.project.table}</Text>
      <div>
        {props.project.categories.map(category => (
          <Tag>{category.name}</Tag>
        ))}
      </div>
      <Text as="b">Scores</Text>
      {Object.entries(scoreData).map((category: any) => {
        let scoreString = "";
        Object.entries(category[1]).map(score => {
          if (scoreString !== "") {
            scoreString = `${scoreString}, ${score[1]}`;
          } else {
            scoreString = `${score[1]}`;
          }
        });
        return <Text>{`${category[0]}: ${scoreString}`}</Text>;
      })}
      {props.project.roomUrl && (
        <a href={props.project.roomUrl} target="_blank" rel="noreferrer">
          Join Video Call
        </a>
      )}
      <Text as="b">Change Round</Text>
      <div>
        <Button disabled={props.project.round === 1} onClick={() => updateRound(-1)} size="small">
          Move Back 1
        </Button>
        <Button style={{ marginLeft: "10px" }} onClick={() => updateRound(1)} size="small">
          Move Up 1
        </Button>
      </div>
      <Text as="b">Change Expo</Text>
      <div>
        <Button disabled={props.project.expo === 1} onClick={() => updateExpo(-1)} size="small">
          Move Back 1
        </Button>
        <Button style={{ marginLeft: "10px" }} onClick={() => updateExpo(1)} size="small">
          Move Up 1
        </Button>
      </div>

      {props.project.members && <Text as="b">Members</Text>}

      <div>
        {
          props.project.members && props.project.members.map(member => (
            <Text key={member.id}>{member.name} ({member.email})</Text>
          ))
        }
      </div>
    </div>
  );

  return (
    <>
      <AccordionItem>
        <h2>
          <AccordionButton _expanded={{ bg: 'purple.400', color: 'white' }}>
            <Box as="span" flex='1' textAlign='left'>
              <Flex alignItems='center' justify='space-between'>
                <Text><Badge>{props.project.id}</Badge> {props.project.name} </Text>

                <Flex gap={4}>
                  <Badge colorScheme={colorSchemeMapper[props.project.round]}>R: {props.project.round}</Badge>

                  <Badge colorScheme={colorSchemeMapper[props.project.expo]}>E: {props.project.expo}</Badge>

                  <Badge colorScheme='blue'>{props.tableGroup !== undefined ? props.tableGroup.shortCode : 1} {props.project.table}
                  </Badge>
                </Flex>
              </Flex>
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4} textAlign='left' fontWeight='normal' bg='purple.100'>
          {content}
        </AccordionPanel>
      </AccordionItem>

      {/* <Popover content={content} placement="bottom">
        <Box
          className="judging-boxes"
          style={{
            background: props.assignment?.status.toString() === "QUEUED" ? "#808080" : "#000000",
          }}
        >
          <Box className="judging-box-top-row" paddingBottom="3">
            <Text>E:{props.project.expo}</Text>
            <Text>R:{props.project.round}</Text>
          </Box>
          <Text className="judging-box-project-id">P{props.project.id}</Text>
          <Box className="judging-box-bottom-row">
            <Text>
              {props.tableGroup !== undefined ? props.tableGroup.shortCode : 1} {props.project.table}
            </Text>
          </Box>
        </Box>
      </Popover> */}


    </>
  );
};

export default JudgingBox;
