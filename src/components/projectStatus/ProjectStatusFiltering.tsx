import React, { useState } from "react";
import { Button, Switch, Flex, HStack, Input, Text } from "@chakra-ui/react";
// import useAxios from "axios-hooks";
// import { apiUrl, Service } from "@hex-labs/core";

interface Props {
  expoNum: any;
  setExpoNum: React.Dispatch<React.SetStateAction<any>>;
  roundNum: any;
  setRoundNum: React.Dispatch<React.SetStateAction<any>>;
}

export default function ProjectStatusFiltering({
  expoNum,
  setExpoNum,
  roundNum,
  setRoundNum,
}: Props) {
  const [expo, setExpo] = useState(expoNum || "");
  const [round, setRound] = useState(roundNum || "");
  const [unjudged, setUnjudged] = useState(false);

  const handleFilter = () => {
    try {
      setExpoNum(expo === "" ? null : parseInt(expo));
      setRoundNum(round === "" ? null : parseInt(round));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Flex
        mb="4"
        py="2"
        px="6"
        borderRadius="12px"
        bgColor="#f2f2f2"
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <HStack spacing="25px">
          <HStack>
            <Text fontSize="md">Expo #:</Text>
            <Input
              value={expo}
              onChange={event => {
                setExpo(event.target.value);
              }}
              bgColor="white"
              w="65px"
            />
          </HStack>
          <HStack>
            <Text fontSize="md">Round #:</Text>
            <Input
              value={round}
              onChange={event => {
                setRound(event.target.value);
              }}
              bgColor="white"
              w="65px"
            />
          </HStack>
          <HStack>
            <Text fontSize="md">Unjudged:</Text>
            <Switch
              size="md"
              onClick={() => {
                setUnjudged(!unjudged);
              }}
              colorScheme="brand"
            />
          </HStack>
        </HStack>
        <Button
          onClick={handleFilter}
          bgColor="#7b69ec"
          borderRadius="25px"
          _hover={{ bgColor: "#a498f5" }}
          color="white"
        >
          Filter
        </Button>
      </Flex>
    </>
  );
}
