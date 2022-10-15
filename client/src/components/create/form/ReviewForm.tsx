import React from "react";
import axios from "axios";
import { Form, Row, Col, message, Input, Button, Typography, Select, Alert } from "antd";
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

const ReviewForm: React.FC<Props> = props => {
  const onFinish = async (values: any) => {
    const hide = message.loading("Loading...", 0);

    console.log(props.data);
    axios
      .post(apiUrl(Service.EXPO, "/projects"), { submission: props.data })
      .then(res => {
        hide();
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

  const prizeOptions = props.data.eligiblePrizes.map((prize: any) => ({
    label: prize.name,
    value: prize.id,
  }));

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
      <Title level={2}>Review Submission</Title>
      <Text>
        Please look over your submission details. You will not be able to change them after you
        submit. By submitting this form, you are agreeing to the project guidelines and cheating
        guidelines we have set{" "}
        <a href="https://live.2020.hack.gt/prizes/" rel="noreferrer" target="_blank">
          here
        </a>
        .
      </Text>
      <Form
        name="review"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
        autoComplete="off"
        initialValues={formInitialValue}
        style={{ marginTop: "10px" }}
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
                      <Input disabled />
                    </Form.Item>
                  </Col>
                </Row>
              ))}
            </div>
          )}
        </Form.List>

        <Row justify="center">
          <Col {...FORM_LAYOUT.full}>
            <Form.Item name="prizes" label="Prizes">
              <Select
                disabled
                mode="multiple"
                showSearch
                options={prizeOptions}
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
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="center">
          <Col {...FORM_LAYOUT.full}>
            <Form.Item name="name" rules={[FORM_RULES.requiredRule]} label="Project Name">
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="center">
          <Col {...FORM_LAYOUT.full}>
            <Form.Item
              name="description"
              rules={[FORM_RULES.requiredRule]}
              label="Description (tell us about your project!)"
            >
              <TextArea rows={4} disabled />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="center">
          <Col {...FORM_LAYOUT.full}>
            <Form.Item name="githubUrl" rules={[FORM_RULES.urlRule]} label="GitHub Url">
              <Input placeholder="https://github.com/HackGT/timber" disabled />
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
                Submit
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default ReviewForm;
