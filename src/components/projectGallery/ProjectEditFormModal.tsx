import React, { useEffect } from "react";
import { Button, Col, Form, Input, message, Modal, Row, Select, InputNumber, Table } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons/lib";
import useAxios from "axios-hooks";
import axios from "axios";
import { apiUrl, Service } from "@hex-labs/core";

import { FORM_RULES } from "../../util/util";
import { FormModalProps } from "../../util/FormModalProps";
import { Category } from "../../types/Category";
import { TableGroup } from "../../types/TableGroup";
import TableGroupsModal from "../admin/panes/tableGroups/TableGroupsModal";
import LoadingDisplay from "../../displays/LoadingDisplay";
import { useCurrentHexathon } from "../../contexts/CurrentHexathonContext";

const ProjectEditFormModal: React.FC<FormModalProps> = props => {
  const [form] = Form.useForm();
  const CurrentHexathonContext = useCurrentHexathon();
  const { currentHexathon } = CurrentHexathonContext;

  useEffect(() => form.resetFields(), [form, props.modalState.initialValues]);

  const [{ loading: categoryLoading, data: categoryData }] = useAxios(
    {
      method: "GET",
      url: apiUrl(Service.EXPO, "/categories"),
      params: {
        hexathon: currentHexathon.id,
      },
    },
    {
      useCache: false,
    }
  );

  const [{ data: tableGroupsData, loading: tableGroupsLoading }] = useAxios(
    {
      url: apiUrl(Service.EXPO, `/table-groups`),
      method: "GET",
      params: {
        hexathon: currentHexathon.id,
      },
    },
    {
      useCache: false,
    }
  );

  // github.com/ant-design/ant-design/issues/22372
  if (categoryLoading || tableGroupsLoading) {
    return <LoadingDisplay />;
  }

  const categoryOptions = categoryLoading
    ? []
    : categoryData.map((category: Category) => ({
        label: category.name,
        value: category.name,
      }));

  const tableGroupsOptions = tableGroupsLoading
    ? []
    : tableGroupsData.map((tableGroup: TableGroup) => ({
        label: tableGroup.name,
        value: tableGroup.id,
      }));

  const roundOptions = ["FLAGGED", "SUBMITTED", "ACCEPTED", "REJECTED"].map((round: string) => ({
    label: round,
    value: round,
  }));

  const onSubmit = async () => {
    const hide = message.loading("Loading...", 0);
    const values = await form.validateFields();

    const formattedMembers = values.members.map((member: any) => ({ email: member.email }));
    values.members = formattedMembers;
    try {
      axios
        .patch(apiUrl(Service.EXPO, `/projects/${props.modalState.initialValues.id}`), {
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
        <Form.List name="members">
          {(fields, { add, remove }) => (
            <div>
              {fields.map((field: any, index: any) => (
                <Row gutter={[8, 0]} key={field.key}>
                  <Col span={24}>
                    <Form.Item
                      name={[field.name, "email"]}
                      fieldKey={[field.fieldKey, "email"]}
                      rules={[FORM_RULES.requiredRule, FORM_RULES.emailRule]}
                      label={`Member ${index + 1}`}
                    >
                      <Input
                        placeholder="hello@gmail.com"
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
                      />
                    </Form.Item>
                  </Col>
                </Row>
              ))}
              {/* Max team size is 4 */}
              {fields.length < 4 ? (
                <Row gutter={[8, 0]}>
                  <Col span={24}>
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

        <Row gutter={[8, 0]}>
          <Col span={24}>
            <Form.Item name="name" rules={[FORM_RULES.requiredRule]} label="Project Name">
              <Input placeholder="Alexa Assistant" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[8, 0]}>
          <Col span={24}>
            <Form.Item name="categories" label="Categories">
              <Select
                placeholder="Select categories"
                mode="multiple"
                options={categoryOptions}
                loading={categoryLoading}
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[8, 0]}>
          <Col span={24}>
            <Form.Item
              name="devpostUrl"
              rules={[FORM_RULES.requiredRule, FORM_RULES.urlRule]}
              label="Devpost URL"
            >
              <Input placeholder="https://devpost.com/software/dyne-cnild7" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[8, 0]}>
          <Col span={24}>
            <Form.Item name="roomUrl" rules={[FORM_RULES.urlRule]} label="Room URL">
              <Input placeholder="https://hexlabs.daily.co/sdj38cjk129f" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[8, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item name="round" label="Round">
              <InputNumber defaultValue={1} style={{ width: "100%" }} precision={0} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item name="expo" label="Expo">
              <InputNumber defaultValue={1} style={{ width: "100%" }} precision={0} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[8, 0]}>
          <Col span={24}>
            <Form.Item name="tableGroupId" label="Table Group">
              <Select
                placeholder="Select table group"
                options={tableGroupsOptions}
                loading={tableGroupsLoading}
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[8, 0]}>
          <Col span={24}>
            <Form.Item name="table" label="Table Number">
              <InputNumber
                min={1}
                // max={
                //   tableGroupsData && props.modalState.initialValues
                //     ? tableGroupsData.find(
                //         (group: any) => group.id === props.modalState.initialValues.tableGroupId
                //       ).tableCapacity
                //     : 16
                // }
                style={{ width: "100%" }}
                precision={0}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ProjectEditFormModal;
