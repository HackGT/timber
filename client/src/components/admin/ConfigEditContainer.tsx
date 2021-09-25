import React from "react";
import { Button, Col, Form, InputNumber, message, Row, Switch } from "antd";
import useAxios from "axios-hooks";

import { FORM_RULES } from "../../util/util";
import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";

const ConfigEditContainer: React.FC = props => {
  const [{ data, loading, error }] = useAxios("/config");

  if (loading) {
    return <LoadingDisplay />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  const onFinish = async (values: any) => {
    const hide = message.loading("Loading...", 0);

    console.log("Submission values:", values);

    // axios
    //   .post("/submission/devpost-validation", values)
    //   .then(res => {
    //     hide();

    //     if (res.data.error) {
    //       message.error(res.data.message, 2);
    //     } else {
    //       props.updateData(values);
    //       props.nextStep();
    //     }
    //   })
    //   .catch(err => {
    //     hide();
    //     message.error("Error: Please ask for help", 2);
    //     console.log(err);
    //   });
  };

  return (
    <Form initialValues={data} onFinish={onFinish} layout="vertical" autoComplete="off">
      <Row gutter={8}>
        <Col span={4}>
          <Form.Item name="currentRound" rules={[FORM_RULES.requiredRule]} label="Current Round">
            <InputNumber type="number" min={1} precision={0} style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item name="currentExpo" rules={[FORM_RULES.requiredRule]} label="Current Expo">
            <InputNumber type="number" min={1} precision={0} style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={6}>
          <Form.Item name="isJudgingOn" label="Is Judging On" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="isProjectsPublished"
            label="Is Projects Published"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="isProjectSubmissionOpen"
            label="Is Project Submission Open"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Update
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ConfigEditContainer;
