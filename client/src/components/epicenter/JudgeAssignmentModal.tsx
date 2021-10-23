import { DownOutlined } from "@ant-design/icons";
import { Form, Modal, Select, Menu, Dropdown } from "antd";
import useAxios from "axios-hooks";
import React, { useEffect, useState } from "react";

import { Project } from "../../types/Project";
import { ModalState } from "../../util/FormModalProps";
import { Category } from "../../types/Category";
import { CategoryGroup } from "../../types/CategoryGroup";
import { User } from "../../types/User";

const { Option } = Select;

type JudgeTypes = {
  visible: boolean;
  handleCancel: () => void;
};

const JudgeAssignmentModal = ({ visible, handleCancel }: JudgeTypes) => {
  const [form] = Form.useForm();
  const [selectedProject, setSelectedProject] = useState({});
  const [selectedUser, setSelectedUser] = useState("");

  const [{ data, loading, error }] = useAxios("/projects");
  const [{ data: userData, loading: userLoading, error: userError }] = useAxios("/user");
  const [users, setUsers] = useState<any[]>([]);

  // const getJudges = () => {
  //   selectedProject;
  // };

  const handleChange = (e: any) => {
    const project: Project = data.find((o: Project) => o.id === e);
    let categoryGroupIds: number[] = [];
    project.categories.forEach((category: Category) => {
      category.categoryGroups.forEach((categoryGroup: CategoryGroup) => {
        categoryGroupIds.push(categoryGroup.id);
      });
    });
    categoryGroupIds = categoryGroupIds.filter(
      (item, index, inputArray) => inputArray.indexOf(item) == index
    );
    type UserArrayType = {
      name: string;
      id: string;
    };
    const userArray: UserArrayType[] = [];
    userData.forEach((user: User) => {
      if (categoryGroupIds.includes(user.categoryGroup.id)) {
        userArray.push({ name: user.name, id: user.id });
      }
    });
    console.log(userArray);
    setSelectedProject(project);
    setUsers(userArray);
  };

  const handleUserChange = (user: string) => {
    setSelectedUser(user);
  };

  return (
    <Modal visible={visible} onCancel={handleCancel}>
      <Form>
        <Select style={{ width: 240 }} onChange={handleChange}>
          {data.map((project: Project) => (
            <Option value={project.id} key={project.id}>
              {project.name}
            </Option>
          ))}
        </Select>
        <Select style={{ width: 240 }} onChange={handleUserChange}>
          {users.map(user => (
            <Option value={user.id}>{user.name}</Option>
          ))}
        </Select>
      </Form>
    </Modal>
  );
};

export default JudgeAssignmentModal;
