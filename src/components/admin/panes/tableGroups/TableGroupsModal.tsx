import React, { useEffect } from "react";
import { Button, Form, Input, InputNumber, message, Modal, Popconfirm } from "antd";
import axios from "axios";
import useAxios from "axios-hooks";
import { apiUrl, Service } from "@hex-labs/core";

import { FORM_RULES, handleAxiosError } from "../../../../util/util";
import { FormModalProps } from "../../../../util/FormModalProps";
import ErrorDisplay from "../../../../displays/ErrorDisplay";
import LoadingDisplay from "../../../../displays/LoadingDisplay";
import { useCurrentHexathon } from "../../../../contexts/CurrentHexathonContext";

const TableGroupsModal: React.FC<FormModalProps> = props => {
  const CurrentHexathonContext = useCurrentHexathon();
  const { currentHexathon } = CurrentHexathonContext;

  const [{ loading: tableGroupsLoading, error: tableGroupsError }] = useAxios({
    method: "GET",
    url: apiUrl(Service.EXPO, "/tablegroups"),
    params: {
      hexathon: currentHexathon.id,
    },
  });

  const [form] = Form.useForm();
  useEffect(() => {
    if (props.modalState.initialValues) {
      form.setFieldsValue(props.modalState.initialValues);
    } else {
      form.resetFields();
    }
  }, [form, props.modalState.initialValues]); // github.com/ant-design/ant-design/issues/22372

  if (tableGroupsLoading) {
    return <LoadingDisplay />;
  }

  if (tableGroupsError) {
    return <ErrorDisplay error={tableGroupsError} />;
  }

  const onDelete = async () => {
    axios
      .delete(apiUrl(Service.EXPO, `/tablegroups/${props.modalState.initialValues.id}`))
      .then(res => {
        message.success("Category group successfully deleted", 2);
        props.setModalState({ visible: false, initialValues: null });
        props.refetch();
      })
      .catch(err => {
        handleAxiosError(err);
      });
  };

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      const hide = message.loading("Loading...", 0);

      if (props.modalState.initialValues) {
        axios
          .patch(apiUrl(Service.EXPO, `/tablegroups/${props.modalState.initialValues.id}`), values)
          .then(res => {
            hide();
            message.success("Table group successfully updated", 2);
            props.setModalState({ visible: false, initialValues: null });
            props.refetch();
          })
          .catch(err => {
            hide();
            handleAxiosError(err);
          });
      } else {
        axios
          .post(apiUrl(Service.EXPO, `/tablegroups`), values)
          .then(res => {
            hide();
            message.success("Table group successfully created", 2);
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

  return (
    <Modal
      visible={props.modalState.visible}
      title={props.modalState.initialValues ? `Manage Table Group` : `Create Table Group`}
      okText={props.modalState.initialValues ? "Update" : "Create"}
      onCancel={() => props.setModalState({ visible: false, initialValues: null })}
      cancelText="Cancel"
      footer={[
        props.modalState.initialValues && (
          <Popconfirm
            title="Are you sure you want to delete this table group?"
            onConfirm={onDelete}
            okText="Yes"
            cancelText="No"
          >
            <Button danger style={{ float: "left" }}>
              Delete
            </Button>
          </Popconfirm>
        ),
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
        <Form.Item name="name" rules={[FORM_RULES.requiredRule]} label="Name">
          <Input placeholder="Klaus Atrium" />
        </Form.Item>
        <Form.Item name="shortCode" rules={[FORM_RULES.requiredRule]} label="Short Code">
          <Input placeholder="ATRIUM" />
        </Form.Item>
        <Form.Item name="tableCapacity" rules={[FORM_RULES.requiredRule]} label="Table Capacity">
          <InputNumber placeholder="100" />
        </Form.Item>
        <Form.Item name="color" rules={[FORM_RULES.requiredRule]} label="Color">
          <Input placeholder="Blue" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TableGroupsModal;
