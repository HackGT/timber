import React from "react";
import axios from "axios";
import { Alert, Button, Col, Form, Input, message, Row, Typography } from "antd";
import { apiUrl, Service } from "@hex-labs/core";

import { FORM_LAYOUT, FORM_RULES, handleAxiosError } from "../../../util/util";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface Props {
  data: any;
  updateData: React.Dispatch<any>;
  nextStep: () => void;
  prevStep: () => void;
}

const DetailInfoForm: React.FC<Props> = props => {
  const onFinish = async (values: any) => {
    const hide = message.loading("Loading...", 0);

    axios
      .post(apiUrl(Service.EXPO, "/projects/special/detail-validation"), values)
      .then(res => {
        hide();
        props.updateData(values);
        props.nextStep();
      })
      .catch(err => {
        hide();
        handleAxiosError(err);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error("Please complete the required fields.", 2);
  };

  const formInitialValue = props.data;

  return (
    <>
      <Alert
        type="error"
        style={{ marginBottom: "15px" }}
        message={
          <strong>
            All information you submit in this form is FINAL, including registering for sponsor
            challenges. There will be no changes made after you submit your project.
          </strong>
        }
      />
      <Title level={2}>Detail Info</Title>
      <Text>Please include more information about your project below!</Text>
      <Form
        name="detail"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
        autoComplete="off"
        initialValues={formInitialValue}
        style={{ marginTop: "10px" }}
      >
        <Row justify="center">
          <Col {...FORM_LAYOUT.full}>
            <Form.Item
              name="description"
              rules={[FORM_RULES.requiredRule]}
              label="Description (tell us about your project!)"
            >
              <TextArea rows={4} />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="center">
          <Col {...FORM_LAYOUT.full}>
            <Form.Item
              name="githubUrl"
              rules={[/* FORM_RULES.requiredRule, */ FORM_RULES.urlRule]}
              label="GitHub Url"
            >
              <Input placeholder="https://github.com/HackGT/timber" />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="center">
          <Col {...FORM_LAYOUT.full}>
            <Form.Item>
              <Button style={{ marginRight: "10px" }} onClick={() => props.prevStep()}>
                Back
              </Button>
              <Button type="primary" htmlType="submit">
                Next
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default DetailInfoForm;
