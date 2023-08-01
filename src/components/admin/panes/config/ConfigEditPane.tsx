import React from "react";
import { Button, Col, Form, InputNumber, message, Row, Select, Switch, Typography } from "antd";
import useAxios from "axios-hooks";
import axios from "axios";
import { apiUrl, Service } from "@hex-labs/core";

import { FORM_RULES } from "../../../../util/util";
import ErrorDisplay from "../../../../displays/ErrorDisplay";
import LoadingDisplay from "../../../../displays/LoadingDisplay";
import { useCurrentHexathon } from "../../../../contexts/CurrentHexathonContext";

const { Title } = Typography;
const { Option } = Select;

const ConfigEditPane: React.FC = props => {
  const CurrentHexathonContext = useCurrentHexathon();
  const { setCurrentHexathon } = CurrentHexathonContext;

  const [{ data, loading, error }, refetch] = useAxios(apiUrl(Service.EXPO, "/config"));
  const [{ data: hexathonsData, loading: hexathonsLoading, error: hexathonsError }] = useAxios(
    apiUrl(Service.HEXATHONS, "/hexathons")
  );

  if (loading || hexathonsLoading) {
    return <LoadingDisplay />;
  }

  if (error || hexathonsError) {
    return <ErrorDisplay error={error} />;
  }

  const onFinish = async (values: any) => {
    const hide = message.loading("Loading...", 0);

    axios
      .post(apiUrl(Service.EXPO, "/config"), values)
      .then(res => {
        const newCurrentHexathonData = hexathonsData.find(
          (hexathon: any) => hexathon.id === values.currentHexathon
        );
        setCurrentHexathon(() => ({ ...newCurrentHexathonData }));
        hide();
        message.success("Config successfully updated", 2);
        refetch();
      })
      .catch(err => {
        hide();
        message.error("Error: Please ask for help", 2);
        console.log(err);
      });
  };

  return (
    <>
      <Title level={3}>Config</Title>
      <Form onFinish={onFinish} layout="vertical" autoComplete="off">
        <Row gutter={8}>
          <Col span={4}>
            <Form.Item
              name="currentRound"
              initialValue={data.currentRound}
              rules={[FORM_RULES.requiredRule]}
              label="Current Round"
            >
              <InputNumber type="number" min={1} precision={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              name="currentExpo"
              initialValue={data.currentExpo}
              rules={[FORM_RULES.requiredRule]}
              label="Current Expo"
            >
              <InputNumber type="number" min={1} precision={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              name="numberOfExpo"
              initialValue={data.numberOfExpo}
              rules={[FORM_RULES.requiredRule]}
              label="Number of Expos"
            >
              <InputNumber type="number" min={1} precision={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              name="currentHexathon"
              initialValue={data.currentHexathon?.id}
              rules={[FORM_RULES.requiredRule]}
              label="Current Hexathon"
            >
              <Select>
                {hexathonsData &&
                  hexathonsData.map((hexathon: any) => (
                    <Option key={hexathon.name} value={hexathon.id}>
                      {hexathon.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <Form.Item
              name="isJudgingOn"
              initialValue={data.isJudgingOn}
              label="Is Judging On"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="isProjectsPublished"
              initialValue={data.isProjectsPublished}
              label="Is Projects Published"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="isProjectSubmissionOpen"
              initialValue={data.isProjectSubmissionOpen}
              label="Is Project Submission Open"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="isDevpostCheckingOn"
              initialValue={data.isDevpostCheckingOn}
              label="Is Devpost Checking Open"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="revealTableGroups"
              initialValue={data.revealTableGroups}
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
