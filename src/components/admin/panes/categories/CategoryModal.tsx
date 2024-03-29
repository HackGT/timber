import React, { useEffect } from "react";
import { Button, Form, Input, message, Modal, Popconfirm, Switch } from "antd";
import axios from "axios";
import { PlusOutlined } from "@ant-design/icons";
import { apiUrl, Service } from "@hex-labs/core";

import { FORM_RULES, handleAxiosError } from "../../../../util/util";
import { FormModalProps } from "../../../../util/FormModalProps";
import QuestionIconLabel from "../../../../util/QuestionIconLabel";
import CriteriaModalCard from "./CriteriaModalCard";

const { TextArea } = Input;

const CategoryFormModal: React.FC<FormModalProps> = props => {
  const [form] = Form.useForm();
  useEffect(() => {
    if (props.modalState.initialValues) {
      form.setFieldsValue(props.modalState.initialValues);
    } else {
      form.resetFields();
    }
  }, [form, props.modalState.initialValues]); // github.com/ant-design/ant-design/issues/22372

  const onDelete = async () => {
    axios
      .delete(apiUrl(Service.EXPO, `/categories/${props.modalState.initialValues.id}`))
      .then(res => {
        message.success("Category successfully deleted", 2);
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
          .patch(apiUrl(Service.EXPO, `/categories/${props.modalState.initialValues.id}`), values)
          .then(res => {
            hide();
            message.success("Category successfully updated", 2);
            props.setModalState({ visible: false, initialValues: null });
            props.refetch();
          })
          .catch(err => {
            hide();
            handleAxiosError(err);
          });
      } else {
        axios
          .post(apiUrl(Service.EXPO, `/categories`), values)
          .then(res => {
            hide();
            message.success("Category successfully created", 2);
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
      title={props.modalState.initialValues ? `Manage Category` : `Create Category`}
      okText={props.modalState.initialValues ? "Update" : "Create"}
      cancelText="Cancel"
      onCancel={() => props.setModalState({ visible: false, initialValues: null })}
      onOk={onSubmit}
      bodyStyle={{ paddingBottom: 0 }}
      footer={[
        props.modalState.initialValues && (
          <Popconfirm
            title="Are you sure you want to delete this category?"
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
    >
      <Form form={form} layout="vertical" autoComplete="off">
        <Form.Item name="name" rules={[FORM_RULES.requiredRule]} label="Name">
          <Input />
        </Form.Item>
        <Form.Item name="description" rules={[FORM_RULES.requiredRule]} label="Description">
          <TextArea rows={3} />
        </Form.Item>
        <Form.Item
          name="isDefault"
          label={
            <QuestionIconLabel
              label="Is Default"
              helpText="Set switch to yes if every project submitted to this hackathon is automatically judged for this category."
            />
          }
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.List name="criterias">
          {(fields, { add, remove }) => (
            <div>
              {fields.map((field: any) => (
                <CriteriaModalCard field={field} remove={remove} />
              ))}

              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  <PlusOutlined />
                  {" Add Criteria"}
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default CategoryFormModal;
