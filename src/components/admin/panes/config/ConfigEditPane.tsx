import React from "react";
import { Button, Col, Form, InputNumber, message, Row, Select, Switch, Typography } from "antd";
import useAxios from "axios-hooks";
import axios from "axios";
import { apiUrl, Service } from "@hex-labs/core";

import { FORM_RULES } from "../../../../util/util";
import ErrorDisplay from "../../../../displays/ErrorDisplay";
import LoadingDisplay from "../../../../displays/LoadingDisplay";

const { Title } = Typography;
const { Option } = Select;

const ConfigEditPane: React.FC = props => {
  const [{ data, loading, error }] = useAxios(apiUrl(Service.EXPO, "/config"));
  const [{ data: hexathonsData, loading: hexathonsLoading, error: hexathonsError }] = useAxios(
    apiUrl(Service.EXPO, "/config/hexathons")
  );

  if (loading || hexathonsLoading) {
    return <LoadingDisplay />;
  }

  if (error || hexathonsError) {
    return <ErrorDisplay error={error} />;
  }

  const onFinish = async (values: any) => {
    const hide = message.loading("Loading...", 0);
    values.currentHexathon = values.hexathon;
    delete values.hexathon;

    axios
      .post(apiUrl(Service.EXPO, "/config"), values)
      .then(res => {
        hide();
        message.success("Config successfully updated", 2);
      })
      .catch(err => {
        hide();
        message.error("Error: Please ask for help", 2);
        console.log(err);
      });
  };

  const hexs = hexathonsData
    ? hexathonsData.map((hexathon: any) => (
        <Option key={hexathon.name} value={hexathon.id}>
          {hexathon.name}
        </Option>
      ))
    : [];

  return (
    <>
      <Title level={3}>Config</Title>
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
          <Col span={4}>
            <Form.Item
              name="numberOfExpo"
              rules={[FORM_RULES.requiredRule]}
              label="Number of Expos"
            >
              <InputNumber type="number" min={1} precision={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              name="hexathon"
              rules={[FORM_RULES.requiredRule]}
              label="Current Hexathon"
              initialValue={data.currentHexathon?.id}
            >
              <Select>{hexs}</Select>
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
          <Col span={6}>
            <Form.Item
              name="isDevpostCheckingOn"
              label="Is Devpost Checking Open"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="revealTableGroups"
              label="Are Table Groups Revealed"
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
    </>
  );
};

export default ConfigEditPane;