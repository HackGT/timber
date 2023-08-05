import React, { useEffect } from "react";
import { Select, Form, Input, message, Modal, Switch, Typography } from "antd";
import axios from "axios";
import useAxios from "axios-hooks";
import { apiUrl, Service } from "@hex-labs/core";

import { FORM_RULES } from "../../../../util/util";
import { FormModalProps } from "../../../../util/FormModalProps";
import QuestionIconLabel from "../../../../util/QuestionIconLabel";
import ErrorDisplay from "../../../../displays/ErrorDisplay";
import LoadingDisplay from "../../../../displays/LoadingDisplay";
import { useCurrentHexathon } from "../../../../contexts/CurrentHexathonContext";

const { Text } = Typography;

const UserFormModal: React.FC<FormModalProps> = props => {
  const CurrentHexathonContext = useCurrentHexathon();
  const { currentHexathon } = CurrentHexathonContext;

  const [{ loading: categoryGroupsLoading, data: categoryGroupsData, error: categoryGroupsError }] =
    useAxios({
      method: "GET",
      url: apiUrl(Service.EXPO, "/categorygroups"),
      params: {
        hexathon: currentHexathon.id,
      },
    });

  const [form] = Form.useForm();
  useEffect(() => form.resetFields(), [form, props.modalState.initialValues]); // github.com/ant-design/ant-design/issues/22372

  if (categoryGroupsLoading) {
    return <LoadingDisplay />;
  }

  if (categoryGroupsError) {
    return <ErrorDisplay error={categoryGroupsError} />;
  }

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      const hide = message.loading("Loading...", 0);

      axios
        .patch(apiUrl(Service.EXPO, `/user/${props.modalState.initialValues.id}`), values)
        .then(res => {
          hide();
          message.success("User successfully updated", 2);
          props.setModalState({ visible: false, initialValues: null });
          props.refetch();
        })
        .catch(err => {
          hide();
          message.error("Error: Please ask for help", 2);
          console.log(err);
        });
    } catch (error) {
      console.log("Validate Failed:", error);
    }
  };

  const categoryGroupsOptions = categoryGroupsLoading
    ? []
    : categoryGroupsData.map((categoryGroup: any) => ({
        label: categoryGroup.name,
        value: categoryGroup.id,
      }));

  return (
    <Modal
      visible={props.modalState.visible}
      title={props.modalState.initialValues ? `Manage Config` : `Create Config`}
      okText={props.modalState.initialValues ? "Update" : "Create"}
      cancelText="Cancel"
      onCancel={() => props.setModalState({ visible: false, initialValues: null })}
      onOk={onSubmit}
      bodyStyle={{ paddingBottom: 0 }}
    >
      <Form
        form={form}
        initialValues={props.modalState.initialValues}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item name="name" rules={[FORM_RULES.requiredRule]} label="Name">
          <Input placeholder="Johnny" />
        </Form.Item>
        <Form.Item name="categoryGroupId" label="Category Group">
          <Select
            placeholder="Select a category group"
            options={categoryGroupsOptions}
            loading={categoryGroupsLoading}
            allowClear
            onChange={(value: any) => {
              // Will remove categoryGroup from user
              if (value === undefined) {
                form.setFieldsValue({ categoryGroupId: null });
              }
            }}
          />
        </Form.Item>
        <Form.Item
          name="isJudging"
          label={
            <QuestionIconLabel
              label="Is Judging"
              helpText="Set switch to yes if this user is judging projects. Any user role can be a judge."
            />
          }
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          name="isSponsor"
          label={
            <QuestionIconLabel
              label="Is Sponsor"
              helpText="This allows users to view the sponsor page for their assigned company."
            />
          }
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Text strong>Email</Text>
        <br />
        <Text>{props.modalState.initialValues?.email || "Not Set"}</Text>
        <br />
        <br />
      </Form>
    </Modal>
  );
};

export default UserFormModal;
