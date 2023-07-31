import React from "react";
import { Card, Tag, Button } from "antd";
import { Text, Alert, AlertIcon, AlertDescription, CloseButton, Flex } from "@chakra-ui/react";

import { Project } from "../../types/Project";
import { Category } from "../../types/Category";
import { User } from "../../types/User";
import { UserRole } from "../../types/UserRole";
import { TableGroup } from "../../types/TableGroup";
import useAxios from "axios-hooks";
import LoadingDisplay from "../../displays/LoadingDisplay";
import ErrorDisplay from "../../displays/ErrorDisplay";

interface Props {
  key: number;
  project: Project;
  user?: User;
  tableGroup: TableGroup | undefined;
  onClick?: (data: any) => any;
}

const ProjectCard: React.FC<Props> = props => {
  const tags = props.project.categories.map((category: Category) => category.name);
  
  const [selectedId, setSelectedId] = React.useState<string>('');
  const [isOpen, setIsOpen] = React.useState(false);
  const handleComponentClick = (tagId: string) => {
    setSelectedId(tagId);
    setIsOpen(true);
  };
  const closeAlert = () => {
    setIsOpen(false);
  };

  
  return (
    <Card
      key={props.key}
      title={
        <span style={{ wordBreak: "break-word", whiteSpace: "normal" }}>{props.project.name}</span>
      }
      extra={
        props.user &&
        [UserRole.ADMIN].includes(props.user.role) && <Button onClick={props.onClick}>Edit</Button>
      }
    >
      <p> Table Group: {props.tableGroup !== undefined ? props.tableGroup.name : 1} </p>
      <p>Table Number: {props.project.table}</p>
      <p>Expo: #{props.project.expo}</p>
      <a href={props.project.devpostUrl}>View Devpost </a>
      {props.project.roomUrl && (
        <p>
          <a href={props.project.roomUrl} target="_blank" rel="noreferrer">
            Join Video Call
          </a>
        </p>
      )}
      {tags.map((tag: string) => (
        <>
          <Flex>
            <Tag>{tag}</Tag>
            <Text fontSize="xs" color="blue.500" _hover={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => handleComponentClick(tag)}>
              What is this?
            </Text>
          </Flex>
          {(selectedId === tag) && (isOpen) && (
            <Alert status='info' variant='subtle' size='xs' mt={4}>
              <AlertIcon />
              <AlertDescription mr={8}>
                {tag || "This"} is a category. Categories are prizes or awards that hackathon submissions can win. 
                For example, “Best Overall”  or “T-Mobile Winner” or “Best Design”. Categories belong 
                to category groups for judging organization purposes.
              </AlertDescription>
              <CloseButton position="absolute" right="8px" top="8px" onClick={closeAlert} />
            </Alert>
          )}
        </>
      ))}
    </Card>
  );
};

export default ProjectCard;
