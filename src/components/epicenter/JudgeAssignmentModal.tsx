import { Form, Modal, Select, Typography, message, Button } from "antd";
import useAxios from "axios-hooks";
import React, { useMemo } from "react";
import axios from "axios";
import { apiUrl, Service } from "@hex-labs/core";

import { Project } from "../../types/Project";
import { FORM_RULES, handleAxiosError } from "../../util/util";
import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";
import { useCurrentHexathon } from "../../contexts/CurrentHexathonContext";

const { Option } = Select;
const { Title } = Typography;

type JudgeTypes = {
  open: boolean;
  handleCancel: () => void;
};

const JudgeAssignmentModal = ({ open, handleCancel }: JudgeTypes) => {
  const { currentHexathon } = useCurrentHexathon();

  const [{ data: projectsData, loading: projectsLoading, error: projectsError }] = useAxios({
    method: "GET",
    url: apiUrl(Service.EXPO, "/projects"),
    params: {
      hexathon: currentHexathon.id,
    },
  });
  const [{ data: categoryGroupsData, loading: categoryGroupsLoading, error: categoryGroupsError }] =
    useAxios({
      method: "GET",
      url: apiUrl(Service.EXPO, "/category-groups"),
      params: {
        hexathon: currentHexathon.id,
      },
    });

  const [form] = Form.useForm();
  const selectedProject = Form.useWatch("project", form);

  // filter projects and get all judges eligible for this project
  const eligibleJudgeOptions = useMemo(() => {
    const project: Project = projectsData?.find((p: Project) => p.id === selectedProject);
    if (!project) {
      return [];
    }

    const projectCategoryGroupsIdSet = new Set(
      project.categories.flatMap(p => p.categoryGroups).map(categoryGroup => categoryGroup.id)
    );

    const eligibleJudges: {
      name: string;
      id: string;
    }[] = [];

    for (const categoryGroup of categoryGroupsData ?? []) {
      if (projectCategoryGroupsIdSet.has(categoryGroup.id)) {
        for (const user of categoryGroup.users) {
          eligibleJudges.push({ name: user.name, id: user.id });
        }
      }
    }

    return eligibleJudges;
  }, [selectedProject, projectsData, categoryGroupsData]);

  if (projectsLoading || categoryGroupsLoading) {
    return <LoadingDisplay />;
  }
  if (projectsError) {
    return <ErrorDisplay error={projectsError} />;
  }
  if (categoryGroupsError) {
    return <ErrorDisplay error={categoryGroupsError} />;
  }

  const onSubmit = async () => {
    const values = await form.validateFields();
    const hide = message.loading("Loading...", 0);
    try {
      await axios.post(apiUrl(Service.EXPO, "/assignments"), {
        user: values.user,
        project: values.project,
      });
      hide();
      message.success("Judge assigned!");
    } catch (err: any) {
      hide();
      handleAxiosError(err);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      okText="Create Assignment"
      onOk={onSubmit}
      destroyOnClose
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Title level={3}>Manual Judge Assignment</Title>
        <Form.Item name="project" label="Project" rules={[FORM_RULES.requiredRule]}>
          <Select
            style={{ width: 250 }}
            showSearch
            placeholder="Select a Project"
            optionFilterProp="children"
            filterOption={(input: any, option: any) =>
              option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {projectsData.map((project: Project) => (
              <Option value={project.id} key={project.id}>
                {project.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="user" label="Judge" rules={[FORM_RULES.requiredRule]}>
          <Select
            showSearch
            placeholder="Select a Judge"
            style={{ width: 250 }}
            disabled={eligibleJudgeOptions.length === 0}
            optionFilterProp="children"
            filterOption={(input: any, option: any) =>
              option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {eligibleJudgeOptions.map(user => (
              <Option value={user.id} key={user.id}>
                {user.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default JudgeAssignmentModal;
