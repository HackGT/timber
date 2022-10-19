import React, { useEffect } from "react";
import { Col, Form, message, Modal, Row, Select } from "antd";
import axios from "axios";
import { apiUrl, Service } from "@hex-labs/core";

import { FormModalProps } from "../../util/FormModalProps";

const { Option } = Select;

const WinnerEditFormModal: React.FC<FormModalProps> = props => {
  const [form] = Form.useForm();
  useEffect(() => form.resetFields(), [form, props.modalState.initialValues]);

  const onSubmit = async () => {
    const hide = message.loading("Loading...", 0);
    const values = await form.validateFields();

    try {
      axios
        .patch(apiUrl(Service.EXPO, `/winner/${props.modalState.initialValues.id}`), {
          ...values,
        })
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
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <Form.Item name="rank" label="Rank">
              <Select placeholder="Select Winner Rank" showSearch optionFilterProp="label">
                <Option value="FIRST">FIRST</Option>
                <Option value="SECOND">SECOND</Option>
                <Option value="THIRD">THIRD</Option>
                <Option value="GENERAL">GENERAL</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default WinnerEditFormModal;
