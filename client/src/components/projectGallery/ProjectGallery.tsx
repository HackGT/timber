import React, { useState } from "react";
import useAxios from "axios-hooks";
import { List, Typography, Input, Select } from "antd";

import { Project } from "../../types/Project";
import ProjectCard from "./ProjectCard";
import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";
import { User } from "../../types/User";
import { ModalState } from "../../util/FormModalProps";
import ProjectEditFormModal from "./ProjectEditFormModal";
import { config } from "process";
import { UserRole } from "../../types/UserRole";

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
      <Search
        placeholder="Search"
        style={{ width: "200px" }}
        value={searchText}
        onChange={event => setSearchText(event.target.value)}
      />
      <Select
        mode="multiple"
        placeholder="Filter by Categories"
        style={{ width: "200px" }}
        onChange={value => setCategoriesSelected(value)}
      >
        {categoryChoices}
      </Select>
      <Select
        placeholder="Sort"
        style={{ width: "200px" }}
        onChange={(value: any) => setSortCondition(value)}
      >
        <Option value="name">Name</Option>
        <Option value="recent">Recent</Option>
      </Select>
      <List
        grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 4 }}
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
