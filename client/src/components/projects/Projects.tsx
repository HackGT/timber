import React, { useState } from "react";
import useAxios from "axios-hooks";
import { List, Typography, Input, Select } from "antd";

import { Project } from "../../types/Project";
import ProjectCard from "./ProjectCard";
import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";
import { User } from "../../types/User";
import { FormModalProps, ModalState } from "../admin/FormModalProps";
import SubmissionEditModal from "../admin/SubmissionEditModal";

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;
interface Props {
  user: User;
}

const Projects: React.FC<Props> = (props) => {
  const [{ loading, data, error }, refetch] = useAxios("/projects");
  const [{ data: categoryData }] = useAxios("/categories");

  const [searchText, setSearchText] = useState("");
  const [categoriesSelected, setCategoriesSelected] = useState([] as any);
  const [sortCondition, setSortCondition] = useState("");

  const [modalState, setModalState] = useState({
    visible: false,
    initialValues: null,
  } as ModalState);

  const openModal = (values: any) => {
    
    const newCategories = values.categories.map((category: any) => category.name)
    console.log(values)
    setModalState({
      visible: true,
      initialValues: {...values, categories: newCategories},
    });
  };

  if (loading) {
    return <LoadingDisplay />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  let updatedData = data
    ? data.filter((item: any) => item.name.toLowerCase().includes(searchText.toLowerCase()))
    : [];

  updatedData =
    categoriesSelected.length !== 0
      ? updatedData.filter((item: any) =>
          item.categories.some((category: any) => categoriesSelected.includes(category.name))
        )
      : updatedData;

  const categoryChoices = categoryData
    ? categoryData.map((item: any) => (
        <Option key={item.name} value={item.name}>
          {item.name}
        </Option>
      ))
    : [];

  const sortByName = (names: any) => names.sort((a: any, b: any) => a.name.localeCompare(b.name));

  if (sortCondition) {
    updatedData = sortCondition === "name" ? sortByName(updatedData) : updatedData;
  }
  const Modal = SubmissionEditModal;
  return (
    <>
      <Title level={2}>Projects</Title>
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
        loading={loading}
        dataSource={updatedData}
        renderItem={(project: Project) => (
          <List.Item>
            <ProjectCard key={project.id} project={project} user={props.user} onClick={() => openModal(project)}/>
          </List.Item>
        )}
      />
      <Modal modalState={modalState} setModalState={setModalState} refetch={refetch} />
    </>
  );
};

export default Projects;
