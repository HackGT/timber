import { DownOutlined } from "@ant-design/icons";
import { Form, Modal, Select, Menu, Dropdown, Typography, message } from "antd";
import useAxios from "axios-hooks";
import React, { useEffect, useState } from "react";
import axios from "axios";

import { Project } from "../../types/Project";
import { ModalState } from "../../util/FormModalProps";
import { Category } from "../../types/Category";
import { CategoryGroup } from "../../types/CategoryGroup";
import { User } from "../../types/User";
import { handleAxiosError } from "../../util/util";
import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";

const { Option } = Select;
const { Title } = Typography;

type JudgeTypes = {
  visible: boolean;
  handleCancel: () => void;
};

const JudgeAssignmentModal = ({ visible, handleCancel }: JudgeTypes) => {
  const [form] = Form.useForm();
  const [selectedProject, setSelectedProject] = useState<Project>();
  const [selectedUser, setSelectedUser] = useState("");

  const [{ data, loading, error }] = useAxios("/projects");
  const [{ data: userData, loading: userLoading, error: userError }] = useAxios("/user");
  const [users, setUsers] = useState<any[]>([]);

  // const getJudges = () => {
  //   selectedProject;
  // };

  if (loading || userLoading) {
    return <LoadingDisplay />;
  }

  if (error || userError) {
    return <ErrorDisplay error={error} />;
  }

  const handleChange = (e: any) => {
    const project: Project = data.find((o: Project) => o.id === e);
    let categoryGroupIds: number[] = [];
    project.categories.forEach((category: Category) => {
      category.categoryGroups.forEach((categoryGroup: CategoryGroup) => {
        categoryGroupIds.push(categoryGroup.id);
      });
    });
    categoryGroupIds = categoryGroupIds.filter(
      (item, index, inputArray) => inputArray.indexOf(item) === index
    );
    type UserArrayType = {
      name: string;
      id: string;
    };
    const userArray: UserArrayType[] = [];
    userData.forEach((user: User) => {
      if (!user.categoryGroup) {
        return;
      }
      if (categoryGroupIds.includes(user.categoryGroup.id)) {
        userArray.push({ name: user.name, id: user.id });
      }
    });
    setSelectedProject(project);
    setUsers(userArray);
  };

  const handleUserChange = (user: string) => {
    setSelectedUser(user);
  };

  const handleSubmit = async () => {
    const user: User = userData.find((o: User) => o.id === selectedUser);
    const hide = message.loading("Loading...", 0);
    try {
      const submittedAssignment = await axios.post("/assignments", {
        user,
        project: selectedProject,
        data: {
          userId: user.id,
          projectId: selectedProject?.id,
          priority: 1,
          categoryIds: user.categoryGroup.categories,
          status: "QUEUED",
        },
      });
      hide();
      message.success("Judge assigned!");
    } catch (err: any) {
      hide();
      handleAxiosError(err);
    }
  };

  return (
    <Modal visible={visible} onCancel={handleCancel} onOk={handleSubmit} okText="Create Assignment">
      <Form>
        <Title level={3}>Manual Assignment</Title>
        <Select style={{ width: 240 }} onChange={handleChange} placeholder="Project">
          {data.map((project: Project) => (
            <Option value={project.id} key={project.id}>
              {project.name}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Judge"
          style={{ width: 240, marginTop: 10 }}
          onChange={handleUserChange}
          disabled={users.length === 0}
        >
          {users.map(user => (
            <Option value={user.id} key={user.id}>
              {user.name}
            </Option>
          ))}
        </Select>
      </Form>
    </Modal>
  );
};

export default JudgeAssignmentModal;
