import React, { useEffect } from "react";
import { Button, Col, Form, Input, message, Modal, Row, Select, InputNumber } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons/lib";
import useAxios from "axios-hooks";
import axios from "axios";

import { FormModalProps } from "../../util/FormModalProps";
import { Ballot } from "../../types/Ballot";

const ProjectEditFormModal: React.FC<FormModalProps> = props => {
  const [form] = Form.useForm();
  const [{ data: ballotData, loading }] = useAxios("/ballot", { useCache: false });

  useEffect(() => form.resetFields(), [form, props.modalState.initialValues]); // github.com/ant-design/ant-design/issues/22372

  const onSubmit = async () => {
    const hide = message.loading("Loading...", 0);
    const values = await form.validateFields();

    console.log(values);
    // const formattedMembers = values.members.map((member: any) => ({ email: member.email }));
    // values.members = formattedMembers;
    console.log(props.modalState.initialValues.id);
    try {
      axios
        .patch(`/ballot/${props.modalState.initialValues.id}`, { ...values })
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
          <Row gutter={[8, 0]}>
            <Col span={24}>
              <Form.Item name="score" label="Score">
                <InputNumber style={{ width: "100%" }} precision={0} min={0} max={5} />{" "}
                {/* update with the ballot's min and max */}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ProjectEditFormModal;
