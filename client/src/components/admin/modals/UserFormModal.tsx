import React, { useEffect } from "react";
import { Select, Form, Input, message, Modal, Radio, Switch, Tooltip, Typography } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons/lib";
import axios from "axios";
import useAxios from "axios-hooks";

import { FORM_RULES } from "../../../util/util";
import { FormModalProps } from "../FormModalProps";
import { UserRole } from "../../../types/UserRole";
import { CategoryGroup } from "../../../types/CategoryGroup";
import QuestionIconLabel from "../../../util/QuestionIconLabel";

const { Text } = Typography;
const { Option } = Select;

const UserFormModal: React.FC<FormModalProps> = props => {
  const [form] = Form.useForm();
  useEffect(() => form.resetFields(), [form, props.modalState.initialValues]); // github.com/ant-design/ant-design/issues/22372

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      const hide = message.loading("Loading...", 0);

      console.log("Submission values:", values);

      axios
        .patch(`/user/${props.modalState.initialValues.id}`, values)
        .then(res => {
          hide();
          message.success("User successfully updated", 2);
          props.setModalState({ visible: false, initialValues: null });
          props.refetch();
        })
        .catch(err => {
          hide();
          message.error("Error: Please ask for help", 2);
          console.log(err);
        });
    } catch (error) {
      console.log("Validate Failed:", error);
    }
  };

  const [{ data }] = useAxios("/categorygroups");

  const accessLevelOptions = [
    {
      value: UserRole.GENERAL,
      label: "General",
      helpText: "This is the general user role. It encompasses participants and judges.",
    },
    {
      value: UserRole.SPONSOR,
      label: "Sponsor",
      helpText: "This allows users to view the sponsor page for their assigned company.",
    },
    {
      value: UserRole.ADMIN,
      label: "Admin",
      helpText:
        "This provides the user with superuser privileges. Allows them to monitor judging process and make updates as needed.",
    },
  ];

  return (
    <Modal
      visible={props.modalState.visible}
      title={props.modalState.initialValues ? `Manage Config` : `Create Config`}
      okText={props.modalState.initialValues ? "Update" : "Create"}
      cancelText="Cancel"
      onCancel={() => props.setModalState({ visible: false, initialValues: null })}
      onOk={onSubmit}
      bodyStyle={{ paddingBottom: 0 }}
    >
      <Form
        form={form}
        initialValues={props.modalState.initialValues}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item name="name" rules={[FORM_RULES.requiredRule]} label="Name">
          <Input placeholder="Johnny" />
        </Form.Item>
        <Form.Item name="categoryGroup" rules={[FORM_RULES.requiredRule]} label="Category Group">
          <Select
            placeholder="Select a category group"
            allowClear
          >
            {data.map((categorygroups: CategoryGroup) => (
              <Option value={categorygroups.name}>
                {categorygroups.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="role" rules={[FORM_RULES.requiredRule]} label="User Role">
          <Radio.Group>
            {accessLevelOptions.map((item: any) => (
              <Radio
                key={item.label}
                style={{ display: "block", height: "30px", lineHeight: "30px" }}
                value={item.value}
                // disabled={initialValues && initialValues.id === currentUser.id} // You can't change your own access level
              >
                {`${item.label} `}
                <Tooltip title={item.helpText}>
                  <QuestionCircleOutlined />
                </Tooltip>
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="isJudging"
          label={
            <QuestionIconLabel
              label="Is Judging"
              helpText="Set switch to yes if this user is judging projects. Any user role can be a judge."
            />
          }
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Text strong>Email</Text>
        <br />
        <Text>{props.modalState.initialValues?.email || "Not Set"}</Text>
        <br />
        <br />
        <Text strong>Ground Truth Id</Text>
        <br />
        <Text>{props.modalState.initialValues?.uuid || "Not Set"}</Text>
        <br />
        <br />
      </Form>
    </Modal>
  );
};

export default UserFormModal;
