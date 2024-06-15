import React, { useState } from "react";
import { Button, Switch, Flex, HStack, Input, Text } from "@chakra-ui/react";
// import useAxios from "axios-hooks";
// import { apiUrl, Service } from "@hex-labs/core";

interface Props {
  expoNum: any;
  setExpoNum: React.Dispatch<React.SetStateAction<any>>;
  roundNum: any;
  setRoundNum: React.Dispatch<React.SetStateAction<any>>;
  unjudged: boolean;
  setUnjudged: React.Dispatch<React.SetStateAction<boolean>>;
  invalidInput: boolean;
  setInvalidInput: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ProjectStatusFiltering({
  expoNum,
  setExpoNum,
  roundNum,
  setRoundNum,
  unjudged,
  setUnjudged,
  invalidInput,
  setInvalidInput,
}: Props) {
  const [expo, setExpo] = useState(expoNum || "");
  const [round, setRound] = useState(roundNum || "");
  const [unjudgedTemp, setUnjudgedTemp] = useState(false);

  const handleFilter = () => {
    setExpoNum(expo === "" ? null : parseInt(expo));
    setRoundNum(round === "" ? null : parseInt(round));
    setUnjudged(unjudgedTemp);
    if (
      (expo.length > 0 && isNaN(parseInt(expo))) ||
      (round.length > 0 && isNaN(parseInt(round)))
    ) {
      setInvalidInput(true);
    } else {
      setInvalidInput(false);
    }
  };

  const handleClear = () => {
    setExpoNum(null);
    setRoundNum(null);
    setUnjudged(false);
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
                setUnjudgedTemp(!unjudgedTemp);
              }}
              colorScheme="brand"
            />
          </HStack>
        </HStack>
        <HStack>
          <Text
            onClick={handleClear}
            _hover={{ cursor: "pointer" }}
            fontSize="md"
            mr="4"
            color="gray.500"
          >
            Clear
          </Text>
          <Button
            onClick={handleFilter}
            bgColor="#7b69ec"
            borderRadius="25px"
            _hover={{ bgColor: "#a498f5" }}
            color="white"
          >
            Filter
          </Button>
        </HStack>
      </Flex>
    </>
  );
}
