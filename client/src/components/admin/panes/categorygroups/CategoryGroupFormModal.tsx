import React, { useEffect } from "react";
import { Form, Input, message, Modal, Select } from "antd";
import axios from "axios";
import useAxios from "axios-hooks";

import { FORM_RULES, handleAxiosError } from "../../../../util/util";
import { FormModalProps } from "../../../../util/FormModalProps";
import ErrorDisplay from "../../../../displays/ErrorDisplay";
import LoadingDisplay from "../../../../displays/LoadingDisplay";

const CategoryGroupFormModal: React.FC<FormModalProps> = props => {
  const [{ loading: userLoading, data: userData, error: userError }] = useAxios("/user");
  const [{ loading: categoriesLoading, data: categoriesData, error: categoriesError }] =
    useAxios("/categories");

  const [form] = Form.useForm();
  useEffect(() => form.resetFields(), [form, props.modalState.initialValues]); // github.com/ant-design/ant-design/issues/22372

  if (userLoading || categoriesLoading) {
    return <LoadingDisplay />;
  }

  if (userError || categoriesError) {
    return <ErrorDisplay error={userError} />;
  }

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      const hide = message.loading("Loading...", 0);

      console.log("Submission values:", values);

      if (props.modalState.initialValues) {
        axios
          .patch(`/categorygroups/${props.modalState.initialValues.id}`, values)
          .then(res => {
            hide();
            message.success("Category group successfully updated", 2);
            props.setModalState({ visible: false, initialValues: null });
            props.refetch();
          })
          .catch(err => {
            hide();
            handleAxiosError(err);
          });
      } else {
        axios
          .post(`/categorygroups`, values)
          .then(res => {
            hide();
            message.success("Category group successfully created", 2);
            props.setModalState({ visible: false, initialValues: null });
            props.refetch();
          })
          .catch(err => {
            hide();
            handleAxiosError(err);
          });
      }
    } catch (error) {
      console.log("Validate Failed:", error);
    }
  };

  const categoryOptions = categoriesLoading
    ? []
    : categoriesData.map((category: any) => ({
        label: category.name,
        value: category.id,
      }));

  const userOptions = userLoading
    ? []
    : userData.map((user: any) => ({
        label: `${user.name} [${user.email}]`,
        value: user.id,
      }));

  return (
    <Modal
      visible={props.modalState.visible}
      title={props.modalState.initialValues ? `Manage Category Group` : `Create Category Group`}
      okText={props.modalState.initialValues ? "Update" : "Create"}
      cancelText="Cancel"
      onCancel={() => props.setModalState({ visible: false, initialValues: null })}
      onOk={onSubmit}
      bodyStyle={{ paddingBottom: 0 }}
    >
      <Form form={form} layout="vertical" autoComplete="off">
        <Form.Item
          name="name"
          rules={[FORM_RULES.requiredRule]}
          label="Name"
          initialValue={props.modalState.initialValues?.name}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="categories"
          label="Categories"
          initialValue={props.modalState.initialValues?.categories.map(
            (category: any) => category.id
          )}
        >
          <Select
            mode="multiple"
            options={categoryOptions}
            optionFilterProp="label"
            loading={categoriesLoading}
            allowClear
          />
        </Form.Item>
        <Form.Item
          name="users"
          label="Users"
          initialValue={props.modalState.initialValues?.users.map((user: any) => user.id)}
        >
          <Select
            mode="multiple"
            options={userOptions}
            optionFilterProp="label"
            loading={userLoading}
            allowClear
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryGroupFormModal;
