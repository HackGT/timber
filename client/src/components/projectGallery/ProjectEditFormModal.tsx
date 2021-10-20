import React, { useEffect } from "react";
import { Button, Col, Form, Input, message, Modal, Row, Select, InputNumber } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons/lib";
import useAxios from "axios-hooks";
import axios from "axios";

import { FORM_LAYOUT, FORM_RULES } from "../../util/util";
import { FormModalProps } from "../../util/FormModalProps";
import { Category } from "../../types/Category";
// interface Props {
//   visible: boolean;
//   closeModal: () => void;
//   initialValues: any;
// }

const ProjectEditFormModal: React.FC<FormModalProps> = props => {
  // console.log(props);
  const [form] = Form.useForm();
  const [{ data: categoryData, loading }] = useAxios("/categories", { useCache: false });

  useEffect(() => form.resetFields(), [form, props.modalState.initialValues]); // github.com/ant-design/ant-design/issues/22372
  console.log(categoryData);
  const categoryOptions = loading
    ? []
    : categoryData.map((category: Category) => ({
        label: category.name,
        value: category.name,
      }));

  const roundOptions = ["FLAGGED", "SUBMITTED", "ACCEPTED", "REJECTED"].map((round: string) => ({
    label: round,
    value: round,
  }));

  const onSubmit = async () => {
    const hide = message.loading("Loading...", 0);
    const values = await form.validateFields();

    console.log(values);
    const formattedMembers = values.members.map((member: any) => ({ email: member.email }));
    values.members = formattedMembers;
    console.log(props.modalState.initialValues.id);
    try {
      axios
        .patch(`/projects/${props.modalState.initialValues.id}`, { ...values })
        .then(res => {
          hide();

          if (res.data.error) {
            message.error(res.data.message, 2);
          } else {
            message.success("Success!", 2);
            props.setModalState({ visible: false, initialValues: null });
            props.refetch();
          }
        })
        .catch(err => {
          hide();
          message.error("Error: Please ask for help", 2);
          console.log(err);
        });
    } catch (info) {
      console.log("Validate Failed:", info);
    }
  };

  return (
    <>
      <Modal
        visible={props.modalState.visible}
        title="Edit Modal"
        okText="Update"
        cancelText="Cancel"
        onCancel={() => props.setModalState({ visible: false, initialValues: null })}
        onOk={onSubmit}
        bodyStyle={{ paddingBottom: 0 }}
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          initialValues={props.modalState.initialValues}
        >
          <Form.List name="members">
            {(fields, { add, remove }) => (
              <div>
                {fields.map((field, index) => (
                  <Row justify="center" key={field.key}>
                    <Col {...FORM_LAYOUT.full}>
                      <Form.Item
                        name={[field.name, "email"]}
                        fieldKey={[field.fieldKey, "email"]}
                        rules={[FORM_RULES.requiredRule, FORM_RULES.emailRule]}
                        label={`Member ${index + 1}`}
                      >
                        <Input
                          placeholder="hello@gmail.com"
                          suffix={
                            fields.length > 1 && index !== 0 ? (
                              <Button
                                type="text"
                                size="small"
                                style={{ margin: 0 }}
                                icon={<DeleteOutlined />}
                                onClick={() => remove(field.name)}
                              />
                            ) : undefined
                          }
                          defaultValue=""
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                ))}
                {/* Max team size is 4 */}
                {fields.length < 4 ? (
                  <Row justify="center">
                    <Col {...FORM_LAYOUT.full}>
                      <Form.Item>
                        <Button type="dashed" onClick={add} block>
                          <PlusOutlined />
                          {" Add Member"}
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                ) : null}
              </div>
            )}
          </Form.List>

          <Row justify="center">
            <Col {...FORM_LAYOUT.full}>
              <Form.Item name="categories" label="Categories">
                <Select
                  placeholder="Select categories"
                  mode="multiple"
                  options={categoryOptions}
                  loading={loading}
                  showSearch
                  optionFilterProp="label"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row justify="center">
            <Col {...FORM_LAYOUT.full}>
              <Form.Item
                name="devpostUrl"
                rules={[FORM_RULES.requiredRule, FORM_RULES.urlRule]}
                label="Devpost URL"
              >
                <Input placeholder="https://devpost.com/software/dyne-cnild7" />
              </Form.Item>
            </Col>
          </Row>

          <Row justify="center">
            <Col {...FORM_LAYOUT.full}>
              <Form.Item name="name" rules={[FORM_RULES.requiredRule]} label="Project Name">
                <Input placeholder="Alexa Assistant" />
              </Form.Item>
            </Col>
          </Row>

          <Row justify="center">
            <Col {...FORM_LAYOUT.full}>
              {/* <Form.Item name="round" rules={[FORM_RULES.requiredRule]} label="Round">
                <Select
                  placeholder="Select round"
                  options={roundOptions}
                  optionFilterProp="label"
                />
              </Form.Item> */}
              <Form.Item name="round" label="Round">
                <InputNumber defaultValue={1} />
              </Form.Item>
            </Col>
          </Row>

          <Row justify="center">
            <Col {...FORM_LAYOUT.full}>
              <Form.Item name="expo" label="Expo">
                <InputNumber defaultValue={1} />
              </Form.Item>
            </Col>
          </Row>

          <Row justify="center">
            <Col {...FORM_LAYOUT.full}>
              <Form.Item name="table" label="Table Number">
                <InputNumber defaultValue={1} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ProjectEditFormModal;
