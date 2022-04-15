import React, { useState } from "react";
import useAxios from "axios-hooks";
import { List, Typography, Input, Select, Col, Form, Row } from "antd";

import { Project } from "../../types/Project";
import ProjectCard from "./ProjectCard";
import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";
import { User } from "../../types/User";
import { ModalState } from "../../util/FormModalProps";
import ProjectEditFormModal from "./ProjectEditFormModal";
import { config } from "process";
import { UserRole } from "../../types/UserRole";
import { FORM_RULES } from "../../util/util";
import { TableGroup } from "../../types/TableGroup";

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;
interface Props {
  user: User;
}

const ProjectGallery: React.FC<Props> = props => {
  const [{ loading: projectsLoading, data: projectsData, error: projectsError }, refetch] =
    useAxios("/projects");
  const [{ loading: categoriesLoading, data: categoriesData, error: categoriesError }] =
    useAxios("/categories");
  const [{ loading: configLoading, data: configData, error: configError }] = useAxios("/config");
  
  const [{ loading: tablegroupsLoading, data: tablegroupsData, error: tablegroupsError }] = useAxios("/tablegroups")
  

  const [searchText, setSearchText] = useState("");
  const [categoriesSelected, setCategoriesSelected] = useState([] as any);
  const [sortCondition, setSortCondition] = useState("");

  const [modalState, setModalState] = useState({
    visible: false,
    initialValues: null,
  } as ModalState);


  const openModal = (values: any) => {
    const newCategories = values.categories.map((category: any) => category.name);
    console.log(values);
    setModalState({
      visible: true,
      initialValues: { ...values, categories: newCategories },
    });
  };

  if (projectsLoading || categoriesLoading || configLoading) {
    return <LoadingDisplay />;
  }

  if (projectsError || categoriesError || configError) {
    return <ErrorDisplay error={projectsError} />;
  }

  if (props.user.role !== UserRole.ADMIN && !configData.isProjectsPublished) {
    return (
      <>
        <Title level={2}>Project Gallery</Title>
        <Title level={5}>The projects aren't published yet. Please check back later!</Title>
      </>
    );
  }

  let updatedData = projectsData
    ? projectsData.filter((item: any) => item.name.toLowerCase().includes(searchText.toLowerCase()))
    : [];

  updatedData =
    categoriesSelected.length !== 0
      ? updatedData.filter((item: any) =>
          item.categories.some((category: any) => categoriesSelected.includes(category.name))
        )
      : updatedData;

  const categoryChoices = categoriesData
    ? categoriesData.map((item: any) => (
        <Option key={item.name} value={item.name}>
          {item.name}
        </Option>
      ))
    : [];

  const sortByName = (names: any) => names.sort((a: any, b: any) => a.name.localeCompare(b.name));

  if (sortCondition) {
    updatedData = sortCondition === "name" ? sortByName(updatedData) : updatedData;
  }

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
            {categoryChoices}
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
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
        loading={projectsLoading}
        dataSource={updatedData}
        renderItem={(project: Project) => (
          <List.Item>
            <ProjectCard
              key={project.id}
              project={project}
              user={props.user}
              onClick={() => openModal(project)}
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
