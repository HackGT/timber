import React from "react";
import axios from "axios";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  Text,
  useToast,
  VStack,
  Stack,
  Flex,
  Badge,
} from "@chakra-ui/react";
import { Service, apiUrl, handleAxiosError } from "@hex-labs/core";
import { Divider, Switch } from "antd";
import useAxios from "axios-hooks";
import { tableNumberToRoom } from "../../util/util";

type SkipModalProps = {
  isOpen: boolean;
  onClose: () => void;
  projects: any;
};

export const SkippedModal = ({ isOpen, onClose, projects }: SkipModalProps) => {
  const toast = useToast();
  const [onlyShowCurrExpo, setOnlyShowCurrExpo] = React.useState(true);
  const onSubmit = async (assignmentId: any) => {
    try {
      await axios.patch(apiUrl(Service.EXPO, `/assignments/${assignmentId}`), {
        data: { status: "QUEUED" },
      });
      toast({
        title: "Success",
        description: "Added project to judging queue!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      window.location.reload();
    } catch (err: any) {
      handleAxiosError(err);
    }
  };
  const [{ data, loading, error }, refetch] = useAxios(apiUrl(Service.EXPO, "/config"));

  if (onlyShowCurrExpo) {
    // filter for only projects in current expo
    projects = projects.filter((project: any) => project.expo === data?.currentExpo);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnOverlayClick>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Skipped Projects</ModalHeader>
        <ModalBody>
          <Flex align="center" gap={2}>
            <Switch
              checked={onlyShowCurrExpo}
              onChange={() => setOnlyShowCurrExpo(!onlyShowCurrExpo)}
            />
            <Text>Show only current expo (current expo: {data?.currentExpo})</Text>
          </Flex>
          <Stack divider={<Divider />} mt={4}>
            {projects.map((project: any) => (
              <Flex
                key={project.id}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <VStack spacing={1} alignItems="start">
                  <Text>
                    <strong>Project Name: </strong>
                    {project.name}
                  </Text>
                  <Text>
                    <strong>Table Number: </strong>
                    {project.table}
                  </Text>
                  <Text>
                    <strong>Table Group: </strong>
                    {tableNumberToRoom(project.table)}
                  </Text>

                  <Text>
                    <strong>Expo: </strong>
                    {project.expo}
                  </Text>
                </VStack>

                <Button
                  colorScheme="purple"
                  size="sm"
                  px="3"
                  onClick={() => onSubmit(project.assignmentId)}
                >
                  Judge
                </Button>
              </Flex>
            ))}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
