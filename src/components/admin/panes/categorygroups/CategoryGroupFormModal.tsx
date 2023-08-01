import React, { useEffect } from "react";
import { Button, Form, Input, message, Modal, Select, Popconfirm } from "antd";
import axios from "axios";
import useAxios from "axios-hooks";
import { apiUrl, Service } from "@hex-labs/core";

import { FORM_RULES, handleAxiosError } from "../../../../util/util";
import { FormModalProps } from "../../../../util/FormModalProps";
import ErrorDisplay from "../../../../displays/ErrorDisplay";
import LoadingDisplay from "../../../../displays/LoadingDisplay";
import { useCurrentHexathon } from "../../../../contexts/CurrentHexathonContext";

const CategoryGroupFormModal: React.FC<FormModalProps> = props => {
  const CurrentHexathonContext = useCurrentHexathon();
  const { currentHexathon } = CurrentHexathonContext;

  const [{ loading: userLoading, data: userData, error: userError }] = useAxios(
    apiUrl(Service.EXPO, "/user")
  );

  const [{ loading: categoriesLoading, data: categoriesData, error: categoriesError }] = useAxios({
    method: "GET",
    url: apiUrl(Service.EXPO, "/categories"),
    params: {
      hexathon: currentHexathon.id,
    },
  });

  const [form] = Form.useForm();
  useEffect(() => form.resetFields(), [form, props.modalState.initialValues]); // github.com/ant-design/ant-design/issues/22372

  if (userLoading || categoriesLoading) {
    return <LoadingDisplay />;
  }

  if (userError || categoriesError) {
    return <ErrorDisplay error={userError} />;
  }
  const onDelete = async () => {
    try {
      if (props.modalState.initialValues) {
        axios
          .delete(apiUrl(Service.EXPO, `/categorygroups/${props.modalState.initialValues.id}`))
          .then(res => {
            message.success("Category group successfully deleted", 2);
            props.setModalState({ visible: false, initialValues: null });
            props.refetch();
          })
          .catch(err => {
            handleAxiosError(err);
          });
      } else {
        message.error("Category group could not be deleted");
      }
    } catch (error) {
      console.log("Validate Failed:", error);
    }
  };
  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      const hide = message.loading("Loading...", 0);

      if (props.modalState.initialValues) {
        axios
          .patch(
            apiUrl(Service.EXPO, `/categorygroups/${props.modalState.initialValues.id}`),
            values
          )
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
          .post(apiUrl(Service.EXPO, `/categorygroups`), values)
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
      onCancel={() => props.setModalState({ visible: false, initialValues: null })}
      cancelText="Cancel"
      footer={[
        <Popconfirm
          title="Are you sure you want to delete this category group?"
          onConfirm={onDelete}
          okText="Yes"
          cancelText="No"
        >
          <Button danger style={{ float: "left" }}>
            Delete
          </Button>
        </Popconfirm>,

        <Button
          key="2"
          onClick={() => props.setModalState({ visible: false, initialValues: null })}
        >
          Cancel
        </Button>,
        <Button key="1" onClick={onSubmit} type="primary">
          {props.modalState.initialValues ? "Update" : "Create"}
        </Button>,
      ]}
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
