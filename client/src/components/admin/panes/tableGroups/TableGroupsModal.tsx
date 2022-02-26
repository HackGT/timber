import React, { useEffect } from "react";
import { Form, Input, message, Modal } from "antd";
import axios from "axios";
import useAxios from "axios-hooks";

import { FORM_RULES, handleAxiosError } from "../../../../util/util";
import { FormModalProps } from "../../../../util/FormModalProps";
import ErrorDisplay from "../../../../displays/ErrorDisplay";
import LoadingDisplay from "../../../../displays/LoadingDisplay";

const TableGroupsModal: React.FC<FormModalProps> = props => {
  const [{ data: tableGroupsData, loading: tableGroupsLoading, error: tableGroupsError }] =
    useAxios("/categorygroups");

  const [form] = Form.useForm();
  useEffect(() => form.resetFields(), [form, props.modalState.initialValues]); // github.com/ant-design/ant-design/issues/22372

  if (tableGroupsLoading) {
    return <LoadingDisplay />;
  }

  if (tableGroupsError) {
    return <ErrorDisplay error={tableGroupsError} />;
  }

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      const hide = message.loading("Loading...", 0);

      console.log("Submission values:", values);

      if (props.modalState.initialValues) {
        axios
          .patch(`/tablegroups/${props.modalState.initialValues.id}`, values)
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
          .post(`/tablegroups`, values)
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
      title={props.modalState.initialValues ? `Manage Table Groups` : `Create Table Group`}
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
          <Input placeholder="Hardware Table" />
        </Form.Item>

        <Form.Item name="shortCode" rules={[FORM_RULES.requiredRule]} label="Short Code">
          <Input placeholder="Hardware" />
        </Form.Item>

        <Form.Item name="color" rules={[FORM_RULES.requiredRule]} label="Color">
          <Input placeholder="Blue" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TableGroupsModal;
