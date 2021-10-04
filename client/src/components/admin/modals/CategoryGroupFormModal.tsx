import React, { useEffect } from "react";
import { Form, Input, message, Modal, Typography } from "antd";
import axios from "axios";

import { FORM_RULES, handleAxiosError } from "../../../util/util";
import { FormModalProps } from "../FormModalProps";

const { Text } = Typography;

const CategoryGroupFormModal: React.FC<FormModalProps> = props => {
  const [form] = Form.useForm();
  useEffect(() => form.resetFields(), [form, props.modalState.initialValues]); // github.com/ant-design/ant-design/issues/22372

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
      <Form
        form={form}
        initialValues={props.modalState.initialValues}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item name="name" rules={[FORM_RULES.requiredRule]} label="Name">
          <Input />
        </Form.Item>
        {props.modalState.initialValues && (
          <>
            <Text strong>Categories</Text>
            <br />
            <ul>
              {props.modalState.initialValues.categories.map((category: any) => (
                <li>{category.name}</li>
              ))}
            </ul>
            <br />
            <br />
            <Text strong>Users</Text>
            <br />
            <ul>
              {props.modalState.initialValues.users.map((user: any) => (
                <li>
                  {user.name} [{user.email}]
                </li>
              ))}
            </ul>
            <br />
            <br />
          </>
        )}
      </Form>
    </Modal>
  );
};

export default CategoryGroupFormModal;
