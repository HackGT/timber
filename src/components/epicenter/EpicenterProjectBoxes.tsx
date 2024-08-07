import { apiUrl, Service } from "@hex-labs/core";
import { Row, Col, Select, Input, Alert } from "antd";
import useAxios from "axios-hooks";
import React, { useState, useEffect } from "react";

import { useCurrentHexathon } from "../../contexts/CurrentHexathonContext";
import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";
import { Ballot } from "../../types/Ballot";
import { Category } from "../../types/Category";
import { Project } from "../../types/Project";
import { TableGroup } from "../../types/TableGroup";
import JudgingBox from "./JudgingBox";
import {
  Accordion,
  Box,
  Text,
  Switch,
  SimpleGrid,
} from "@chakra-ui/react";

const { Option } = Select;
const { Search } = Input;

const EpicenterProjectBoxes: React.FC = () => {
  const CurrentHexathonContext = useCurrentHexathon();
  const { currentHexathon } = CurrentHexathonContext;
  const [autoUpdate, setAutoUpdate] = useState(false);

  const [{ loading: categoriesLoading, data: categoriesData, error: categoriesError }] = useAxios({
    method: "GET",
    url: apiUrl(Service.EXPO, "/categories"),
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

  const [{ loading: projectsLoading, data: projectsData, error: projectsError }, refetchProjects] =
    useAxios({
      method: "GET",
      url: apiUrl(Service.EXPO, "/projects"),
      params: {
        hexathon: currentHexathon?.id,
      },
    });

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (autoUpdate) {
      intervalId = setInterval(() => {
        refetchProjects();
        console.log("Updated Projects!")
      }, 2000);
    }
    return () => { clearInterval(intervalId) }
  }, [autoUpdate])


  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<any>(undefined);
  const [sortCondition, setSortCondition] = useState("default");
  const [round, setRound] = useState(0);
  const [judged, setJudged] = useState(0);
  const [expo, setExpo] = useState(0);
  const [tableGroup, setTableGroup] = useState(0);
  const [tableNumber, setTableNumber] = useState(0);

  if (projectsData === undefined) {
    return <LoadingDisplay />;
  }
  if (categoriesLoading || tableGroupsLoading) {
    return <LoadingDisplay />;
  }


  if (projectsError || categoriesError || tableGroupsError) {
    return <ErrorDisplay error={projectsError} />;
  }

  let updatedData = projectsData
    ? (projectsData
      .filter((project: Project) =>
        project.name.toLowerCase().includes(searchText.toLowerCase()) ||
        project.members.some((nameObj) => nameObj.name.toLowerCase().includes(searchText.toLowerCase()))
      )
      .filter((project: Project) => round === 0 || project.round === round)
      .filter((project: Project) => expo === 0 || project.expo === expo)
      .filter((project: Project) => tableGroup === 0 || project.tableGroup.id === tableGroup)
      .filter((project: Project) => tableNumber === 0 || project.table === tableNumber))
    : [];

  updatedData = selectedCategory
    ? updatedData.filter((project: Project) =>
      project.categories.map((category: Category) => category.id).includes(selectedCategory)
    )
    : updatedData;

  if (selectedCategory && sortCondition === "highest") {
    const scoreData: any = {};

    updatedData.forEach((project: Project) => {
      project.ballots.forEach((ballot: Ballot) => {
        if (ballot.criteria.categoryId === selectedCategory) {
          scoreData[project.id] = (scoreData[project.id] || 0) + ballot.score;
        }
      });
    });

    updatedData = updatedData.sort(
      (a: any, b: any) => (scoreData[b.id] || 0) - (scoreData[a.id] || 0)
    );
  }

  const categoryOptions = categoriesData
    ? categoriesData.map((category: Category) => ({
      label: category.name,
      value: category.id,
    }))
    : [];
  let maxRound = 0;
  let maxExpo = 0;
  let maxTableNumber = 0;
  for (let i = 0; i < projectsData.length; i++) {
    if (projectsData[i].round > maxRound) {
      maxRound = projectsData[i].round;
    }
    if (projectsData[i].expo > maxExpo) {
      maxExpo = projectsData[i].expo;
    }
    if (projectsData[i].table > maxTableNumber) {
      maxTableNumber = projectsData[i].table;
    }
  }

  const maxRoundArr = new Array(maxRound).fill(0);
  const maxExpoArr = new Array(maxExpo).fill(0);
  const maxTableNumberArr = new Array(maxTableNumber).fill(0);

  if (judged != 0) {
    // judged = 0 = show unjudged projects
    updatedData = updatedData.filter((project: Project) => project.ballots.length == 0);
  }


  // const tableGroupMap = new Map<number, TableGroup>();

  // tableGroupsData.forEach((tableGroupItem: TableGroup) => {
  //   tableGroupMap.set(tableGroupItem.id, tableGroupItem);
  // });

  // we need to split updated data into 3 arrays of equal length

  const splitToNChunks = (array: any, n: number) => {
    const result = [];
    for (let i = n; i > 0; i--) {
      result.push(array.splice(0, Math.ceil(array.length / i)));
    }
    return result;
  }

  const numProjects = updatedData.length;
  const splitData = splitToNChunks(updatedData, 3);

  return (
    <>
      <Text fontSize='md' mb={2} color='black'><Switch colorScheme='purple' isChecked={autoUpdate} onChange={() => {
        setAutoUpdate(!autoUpdate);
      }} /> auto update {autoUpdate ? "enabled" : "not enabled"}  • {numProjects} projects total</Text>

      {
        judged == 1 && (
          <Box mb={2}>
            <Alert
              message="Currently showing all projects with 0 ballots cast. Note that some projects may have >= 1 ballots cast, but still need to be judged more times."
              type="warning"
              showIcon
            />
          </Box>
        )
      }

      <Row gutter={[8, 8]} style={{ marginBottom: "20px" }}>
        <Col xs={24} sm={8} md={5}>
          <Search
            placeholder="Search"
            value={searchText}
            onChange={event => setSearchText(event.target.value)}
          />
        </Col>
        <Col xs={24} sm={16} md={5}>
          <Select
            placeholder="Filter by Category"
            style={{ width: "100%" }}
            options={categoryOptions}
            optionFilterProp="label"
            onChange={value => setSelectedCategory(value)}
            allowClear
          />
        </Col>
        <Col xs={24} sm={8} md={2}>
          <Select value={judged} style={{ width: "100%" }} onChange={value => setJudged(value)}>
            <Option value={0}>J: All</Option>
            <Option value={1}>J: Unjudged</Option>
          </Select>

          {/* <Select value={round} style={{ width: "100%" }} onChange={value => setRound(value)}>
            <Option value={0}>R: All</Option>
            {maxRoundArr.map((project: Project, index) => (
              <Option value={index + 1}> R: {index + 1}</Option>
            ))}
          </Select> */}
        </Col>
        <Col xs={24} sm={8} md={2}>
          <Select value={expo} style={{ width: "100%" }} onChange={value => setExpo(value)}>
            <Option value={0}>E: All</Option>
            {maxExpoArr.map((project: Project, index) => (
              <Option value={index + 1}> E: {index + 1}</Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={8} md={3}>
          <Select
            value={tableGroup}
            style={{ width: "100%" }}
            onChange={value => setTableGroup(value)}
          >
            <Option value={0}>Table Group: All</Option>
            {tableGroupsData.map((tableG: TableGroup) => (
              <Option value={tableG.id}> Table Group: {tableG.name}</Option>
            ))}
            {/* <Option value={1}>Table Group: 1</Option>
            <Option value={2}>Table Group: 2</Option>
            <Option value={3}>Table Group: 3</Option> */}
          </Select>
        </Col>
        <Col xs={24} sm={8} md={3}>
          <Select
            value={tableNumber}
            style={{ width: "100%" }}
            onChange={value => setTableNumber(value)}
          >
            <Option value={0}>Table Number: All</Option>
            {maxTableNumberArr.map((project: Project, index) => (
              <Option value={index + 1} key={project.id}> Table Number: {index + 1}</Option>
            ))}
            {/* <Option value={1}>Table Number: 1</Option>
            <Option value={2}>Table Number: 2</Option>
            <Option value={3}>Table Number: 3</Option> */}
          </Select>
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Select
            placeholder="Sort"
            style={{ width: "100%" }}
            onChange={(value: string) => setSortCondition(value)}
            disabled={!selectedCategory}
            value={sortCondition}
          >
            <Option value="default">Default Sort</Option>
            <Option value="highest">Sort by Highest Score</Option>
          </Select>
        </Col>
      </Row>
      <div id="judging">

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} w='full'>
          {
            splitData.map((data: Project[]) => (
              <Accordion allowMultiple w='100%'>
                {data.map((project: Project) => (
                  <JudgingBox

                    key={project.id}
                    project={project}
                    tableGroup={project.tableGroup}
                    refetch={refetchProjects}
                  />
                ))}
              </Accordion>
            ))
          }
          {/* <Accordion allowMultiple w='100%'>
            {data1.map((project: Project) => (
              <JudgingBox
                key={project.id}
                project={project}
                tableGroup={project.tableGroup}
                refetch={refetchProjects}
              />
            ))}
          </Accordion>

          <Accordion allowMultiple w='100%'>
            {data2.map((project: Project) => (
              <JudgingBox
                key={project.id}
                project={project}
                tableGroup={project.tableGroup}
                refetch={refetchProjects}
              />
            ))}
          </Accordion>

          <Accordion allowMultiple w='100%'>
            {data3.map((project: Project) => (
              <JudgingBox
                key={project.id}
                project={project}
                tableGroup={project.tableGroup}
                refetch={refetchProjects}
              />
            ))}
          </Accordion> */}
        </SimpleGrid>

        {/* <Accordion allowMultiple w='100%'>
          {updatedData.map((project: Project) => (
            <JudgingBox
              key={project.id}
              project={project}
              tableGroup={project.tableGroup}
              refetch={refetchProjects}
            />
          ))}
        </Accordion> */}


        {/* <AllProjectBoxes
          projects={updatedData}
        /> */}
      </div >
    </>
  );
};

export default EpicenterProjectBoxes;
