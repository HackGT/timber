import React, { useState } from "react";
import useAxios from "axios-hooks";
import { List, Typography, Input, Select, Col, Row, Divider } from "antd";
import { apiUrl, Service } from "@hex-labs/core";

import { Project } from "../../types/Project";
import ProjectCard from "./ProjectCard";
import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";
import { User } from "../../types/User";
import { ModalState } from "../../util/FormModalProps";
import ProjectEditFormModal from "./ProjectEditFormModal";
import { useCurrentHexathon } from "../../contexts/CurrentHexathonContext";

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;
interface Props {
  user: User;
}

const ProjectGallery: React.FC<Props> = props => {
  const CurrentHexathonContext = useCurrentHexathon();
  const { currentHexathon } = CurrentHexathonContext;

  const [searchText, setSearchText] = useState("");
  const [categoriesSelected, setCategoriesSelected] = useState([] as any);
  const [selectedCategory, setSelectedCategory] = useState<any>(undefined);

  const [sortCondition, setSortCondition] = useState("");

  const [{ loading: projectsLoading, data: projectsData, error: projectsError }, refetch] =
    useAxios({
      method: "GET",
      url: apiUrl(Service.EXPO, "/projects"),
      params: {
        hexathon: currentHexathon.id,
        search: searchText,
        categories: categoriesSelected,
      },
    });

  const [{ loading: categoriesLoading, data: categoriesData, error: categoriesError }] = useAxios({
    method: "GET",
    url: apiUrl(Service.EXPO, "/categories"),
    params: {
      hexathon: currentHexathon.id,
    },
  });

  const [{ data: winnersData, loading: winnersLoading, error: winnersError }] = useAxios({
    method: "GET",
    url: apiUrl(Service.EXPO, "/winners"),
    params: {
      hexathon: currentHexathon.id,
    },
  });

  const [{ loading: configLoading, data: configData, error: configError }] = useAxios(
    apiUrl(Service.EXPO, "/config")
  );

  const [modalState, setModalState] = useState({
    visible: false,
    initialValues: null,
  } as ModalState);

  const openModal = (values: any) => {
    console.log("Clicked");
    const newCategories = values.categories.map((category: any) => category.name);
    setModalState({
      visible: true,
      initialValues: { ...values, categories: newCategories },
    });
  };

  if (categoriesLoading || configLoading || winnersLoading) {
    return <LoadingDisplay />;
  }

  if (projectsError || categoriesError || configError || winnersError) {
    return <ErrorDisplay error={projectsError} />;
  }

  if (!props.user.roles.admin && !configData.isProjectsPublished) {
    return (
      <>
        <Title level={2}>Project Gallery</Title>
        <Title level={5}>The projects aren't published yet. Please check back later!</Title>
      </>
    );
  }

  let updatedData = projectsData || [];

  const sortByName = (names: any) => names.sort((a: any, b: any) => a.name.localeCompare(b.name));
  if (sortCondition) {
    updatedData = sortCondition === "name" ? sortByName(updatedData) : updatedData;
  }

  const winnerIds = new Set();
  winnersData.forEach((winner: any) => {
    winnerIds.add(winner.id);
  });

  return (
    <>
      <Title level={2}>Project Gallery</Title>
      <Row gutter={[8, 8]} style={{ marginBottom: "20px" }}>
        <Col xs={24} sm={8} md={8}>
          <Search
            placeholder="Search"
            value={searchText}
            onChange={event => setSearchText(event.target.value)}
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Select
            mode="multiple"
            placeholder="Filter by Categories"
            style={{ width: "100%" }}
            onChange={value => setCategoriesSelected(value)}
          >
            {categoriesData &&
              categoriesData.map((item: any) => (
                <Option key={item.name} value={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </Col>
        <Col xs={24} sm={4} md={4}>
          <Select
            placeholder="Sort"
            style={{ width: "100%" }}
            onChange={(value: any) => setSortCondition(value)}
          >
            <Option value="name">Name</Option>
            <Option value="recent">Recent</Option>
          </Select>
        </Col>
      </Row>
      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 5, xxl: 6 }}
        loading={projectsLoading}
        dataSource={updatedData}
        renderItem={(project: Project) => (
          <List.Item>
            <ProjectCard
              key={project.id}
              project={project}
              user={props.user}
              onClick={() => openModal(project)}
              isWinner={configData.revealWinners ? winnerIds.has(project.id) : false}
            />
          </List.Item>
        )}
      />
      <ProjectEditFormModal
        modalState={modalState}
        setModalState={setModalState}
        refetch={refetch}
      />
    </>
  );
};

export default ProjectGallery;
