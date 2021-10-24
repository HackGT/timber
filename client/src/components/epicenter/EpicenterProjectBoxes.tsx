import { Row, Col, Select, Input } from "antd";
import useAxios from "axios-hooks";
import React, { useState } from "react";

import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";
import { Ballot } from "../../types/Ballot";
import { Project } from "../../types/Project";
import JudgingBox from "./JudgingBox";

const { Option } = Select;
const { Search } = Input;

const EpicenterProjectBoxes: React.FC = () => {
  const [{ loading: projectsLoading, data: projectsData, error: projectsError }, refetchProjects] =
    useAxios("/projects");
  const [{ loading: categoriesLoading, data: categoriesData, error: categoriesError }] =
    useAxios("/categories");

  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<any>(undefined);
  const [sortCondition, setSortCondition] = useState("default");
  const [round, setRound] = useState(0);
  const [expo, setExpo] = useState(0);

  if (projectsLoading || categoriesLoading) {
    return <LoadingDisplay />;
  }

  if (projectsError || categoriesError) {
    return <ErrorDisplay error={projectsError} />;
  }

  let updatedData = projectsData
    ? projectsData
        .filter((project: any) => project.name.toLowerCase().includes(searchText.toLowerCase()))
        .filter((project: any) => round === 0 || project.round === round)
        .filter((project: any) => expo === 0 || project.expo === expo)
    : [];

  updatedData = selectedCategory
    ? updatedData.filter((project: any) =>
        project.categories.map((category: any) => category.id).includes(selectedCategory)
      )
    : updatedData;

  if (selectedCategory && sortCondition === "highest") {
    const scoreData: any = {};

    updatedData.forEach((project: any) => {
      console.log(updatedData);
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
    ? categoriesData.map((category: any) => ({
        label: category.name,
        value: category.id,
      }))
    : [];

  return (
    <>
      <Row gutter={[8, 8]} style={{ marginBottom: "20px" }}>
        <Col xs={24} sm={8} md={6}>
          <Search
            placeholder="Search"
            value={searchText}
            onChange={event => setSearchText(event.target.value)}
          />
        </Col>
        <Col xs={24} sm={16} md={8}>
          <Select
            placeholder="Filter by Category"
            style={{ width: "100%" }}
            options={categoryOptions}
            optionFilterProp="label"
            onChange={value => setSelectedCategory(value)}
            allowClear
          />
        </Col>
        <Col xs={24} sm={8} md={3}>
          <Select value={round} style={{ width: "100%" }} onChange={value => setRound(value)}>
            <Option value={0}>R: All</Option>
            <Option value={1}>R: 1</Option>
            <Option value={2}>R: 2</Option>
            <Option value={3}>R: 2</Option>
          </Select>
        </Col>
        <Col xs={24} sm={8} md={3}>
          <Select value={expo} style={{ width: "100%" }} onChange={value => setExpo(value)}>
            <Option value={0}>E: All</Option>
            <Option value={1}>E: 1</Option>
            <Option value={2}>E: 2</Option>
          </Select>
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Select
            placeholder="Sort"
            style={{ width: "100%" }}
            onChange={(value: any) => setSortCondition(value)}
            disabled={!selectedCategory}
            value={sortCondition}
          >
            <Option value="default">Default Sort</Option>
            <Option value="highest">Sort by Highest Score</Option>
          </Select>
        </Col>
      </Row>
      <div id="judging">
        {updatedData.map((project: Project) => (
          <JudgingBox key={project.id} project={project} refetch={refetchProjects} />
        ))}
      </div>
    </>
  );
};

export default EpicenterProjectBoxes;
