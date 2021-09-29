import React from "react";
import axios from "axios";
import { Alert, Button, Col, Form, message, Row, Select, Typography } from "antd";

import { FORM_LAYOUT, handleAxiosError } from "../../../util/util";

const { Title, Text } = Typography;

interface Props {
  data: any;
  updateData: React.Dispatch<any>;
  nextStep: () => void;
  prevStep: () => void;
}

const PrizeInfoForm: React.FC<Props> = props => {
  const onFinish = async (values: any) => {
    const hide = message.loading("Loading...", 0);

    axios
      .post("/projects/prize-validation", values)
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

  const prizeOptions = props.data.eligiblePrizes.map((prize: string) => ({
    label: prize,
    value: prize,
  }));

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
      <Title level={2}>Prize Info</Title>
      <Text>
        Please select the prizes you would like to be considered for. Note, every team is
        automatically considered for the Best Overall prize. Based on your team members, these are
        the prizes you are eligible to choose from. If you believe something is wrong, please ask a
        question at help desk.
      </Text>
      <Form
        name="prize"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
        autoComplete="off"
        style={{ marginTop: "10px" }}
        initialValues={formInitialValue}
      >
        <Row justify="center">
          <Col {...FORM_LAYOUT.full}>
            <Form.Item name="prizes" label="Prizes" initialValue={[]}>
              <Select
                placeholder="Select prizes"
                mode="multiple"
                options={prizeOptions}
                showSearch
                optionFilterProp="label"
              />
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

export default PrizeInfoForm;
