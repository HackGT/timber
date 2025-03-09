import React from "react";
import { Form, Row, Col, message, Input, Button, Typography, Alert } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { apiUrl, Service, useAuth } from "@hex-labs/core";

import { User } from "../../../types/User";
import { FORM_LAYOUT, FORM_RULES, handleAxiosError } from "../../../util/util";
import useAxios from "axios-hooks";

const { Title, Text } = Typography;

interface Props {
  data: any;
  updateData: React.Dispatch<any>;
  user: User;
  nextStep: () => void;
}

const TeamInfoForm: React.FC<Props> = props => {
  const theUser = useAuth();
  const [{ data: hexathonsData, loading: hexathonsLoading, error: hexathonsError }] = useAxios(
    apiUrl(Service.HEXATHONS, "/hexathons")
  );

  const activeHexathon = hexathonsData?.find((hexathon: any) => hexathon.isActive); // TODO: change to current hexathon context
  // TODO: verify that isTeamBased is set to true 
  const [{ data: teamsData, loading: teamsLoading, error: teamsError }] = useAxios(
    {
      url: apiUrl(Service.HEXATHONS, `/teams`),
      params: {
        hexathon: activeHexathon?.id,
        userId: (theUser as any)?.user?.uid,
      }
    }
  );

  const onFinish = async (values: any) => {
    const hide = message.loading("Loading...", 0);
    const newValues = {
      members: values.members.map((value: any) => ({ email: value.email })),
    };

    axios
      .post(apiUrl(Service.EXPO, "/projects/submission/team-validation"), newValues)
      .then(res => {
        hide();
        props.updateData({
          ...newValues,
          eligiblePrizes: res.data.eligiblePrizes,
        });
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


  if (teamsLoading) {
    return <Text>Loading...</Text>;
  }

  let formInitialValue: { members?: { email: string }[] } = {};

  if (props.data.members) {
    console.log("props.data", props.data);
    formInitialValue = props.data;
  } else if (teamsData && teamsData.count > 0) {
    const emails = teamsData.teams[0].members.map((member: any) => ({ email: member.email }));

    const first = theUser?.user?.email;
    // eslint-disable-next-line no-nested-ternary
    emails.sort((a: any, b: any) => (a.email === first ? -1 : b.email === first ? 1 : 0));
    formInitialValue = { members: emails };
  } else {
    formInitialValue = {
      members: [
        {
          email: props.user.email,
        },
      ],
    };
  }

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
      <Title level={2}>Team Info</Title>
      <Text>
        Please list all the emails of all your team members below. Make sure the emails used are the
        ones that they were accepted for through registration. Data is auto-populated based on match.hexlabs.org (if available).
      </Text>
      <Form
        name="team"
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
              {fields.map((field: any, index: any) => (
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
                        disabled={index === 0}
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
            <Form.Item>
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

export default TeamInfoForm;
