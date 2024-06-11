import React, { useEffect } from "react";
import { Col, Form, message, Modal, Row, Slider } from "antd";
import axios from "axios";
import { apiUrl, Service } from "@hex-labs/core";

import { FormModalProps } from "../../util/FormModalProps";
import { FORM_RULES, handleAxiosError } from "../../util/util";

const ProjectEditFormModal: React.FC<FormModalProps> = props => {
  const [form] = Form.useForm();

  useEffect(() => form.resetFields(), [form, props.modalState.initialValues]); // github.com/ant-design/ant-design/issues/22372

  const onSubmit = async () => {
    const hide = message.loading("Loading...", 0);
    const values = await form.validateFields();

    const scoreMappings: any = {};
    values.scores.forEach((score: any, index: number) => {
      scoreMappings[parseInt(score.id)] = parseInt(score.score); // id : value
    });

    try {
      axios
        .post(apiUrl(Service.EXPO, `/ballots/batch/update`), scoreMappings)
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
          handleAxiosError(err);
        });
    } catch (info) {
      console.log("Validate Failed:", info);
    }
  };

  return (
    <Modal
      visible={props.modalState.visible}
      title="Edit Score Modal"
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
        <Form.List name="scores">
          {fields => {
            const { scores } = props.modalState.initialValues;
            return (
              <div>
                {fields.map((field: any, index: any) => (
                  <Row gutter={[8, 0]} key={field.key}>
                    <Col span={24}>
                      <Form.Item
                        name={[field.name, "score"]}
                        fieldKey={[field.fieldKey, "score"]}
                        rules={[FORM_RULES.requiredRule]}
                        label={scores[field.fieldKey].criteria.name}
                      >
                        <Slider min={0} max={10} marks={{ 0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10' }} />
                      </Form.Item>
                    </Col>
                  </Row>
                ))}
              </div>
            );
          }}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default ProjectEditFormModal;
