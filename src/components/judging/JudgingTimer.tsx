import { HeaderItem } from "@hex-labs/core";
import { Text, Box, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";

const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

  return `${formattedMinutes}:${formattedSeconds}`;
};

const JudgingTimer: React.FC<any> = () => {
  const [time, setTime] = useState(0);
  const [isPopupOpen, setPopupOpen] = useState(false);

  const countdownTimerStyle = {
    fontFamily: "monospace",
    padding: "5px",
    border: "2px solid #333",
    borderRadius: "5px",
    backgroundColor: "#f0f0f0",
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prevTime: number) => {
        // Show popup when the timer hits 4 minutes (240 seconds)
        if (prevTime === 240) {
          setPopupOpen(true);
          clearInterval(intervalId);
        }
        return prevTime + 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleClosePopup = () => {
    setPopupOpen(false);
    // Resume the timer
    const resumeIntervalId = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

  };

  return (
    <HeaderItem>
      <Box display="block">
        <Text textAlign="right">
          <span id="current-time" style={countdownTimerStyle}>
            {formatTime(time)}
          </span>
        </Text>
      </Box>

      <Modal isOpen={isPopupOpen} onClose={handleClosePopup}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Please Wrap Up Judging</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>The timer has reached 4 minutes</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleClosePopup}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </HeaderItem>
  );
};

export default JudgingTimer;
