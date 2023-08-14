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
} from "@chakra-ui/react";
import { Service, apiUrl, handleAxiosError } from "@hex-labs/core";

type SkipModalProps = {
  isOpen: boolean;
  onClose: () => void;
  projects: any;
};

export const SkippedModal = ({ isOpen, onClose, projects }: SkipModalProps) => {
  const toast = useToast();
  const onSubmit = async (assignmentId: any) => {
    try {
      await axios.patch(apiUrl(Service.EXPO, `/assignments/${assignmentId}`), {
        data: { status: "STARTED" },
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnOverlayClick>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Skipped Projects</ModalHeader>
        <ModalBody>
          <Box display="grid">
            {projects.map((project: any) => (
              <Box key={project.id} display="flex" justifyContent="space-between" pb="2">
                <Text fontSize="18px" display="flex" height="100%">
                  <Text fontSize="18px" fontWeight="bold" height="100%">
                    Name:&nbsp;
                  </Text>{" "}
                  {project.name}
                </Text>
                <Button
                  colorScheme="purple"
                  size="xs"
                  px="3"
                  onClick={() => onSubmit(project.assignmentId)}
                >
                  Judge
                </Button>
              </Box>
            ))}
          </Box>
        </ModalBody>
      </ModalContent>
      <ModalFooter>
        <Button colorScheme="blue" mr={3} onClick={onClose}>
          Close
        </Button>
        <Button variant="ghost">Secondary Action</Button>
      </ModalFooter>
    </Modal>
  );
};
