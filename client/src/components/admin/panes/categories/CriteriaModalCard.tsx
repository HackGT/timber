import React from "react";
import { Button, Card, Col, Form, Input, InputNumber, Popconfirm, Row } from "antd";

import { FORM_RULES } from "../../../../util/util";

const { TextArea } = Input;

interface FieldData {
  name: number;
  key: number;
  fieldKey: number;
}

interface Props {
  field: FieldData;
  remove: (index: number) => void;
}

const CriteriaModalCard: React.FC<Props> = props => (
  <Card
    size="small"
    title={`Criteria ${props.field.name + 1}`}
    style={{ marginBottom: "15px" }}
    extra={
      <Popconfirm
        title="Are you sure you want to delete this criteria?"
        onConfirm={() => props.remove(props.field.name)}
        okText="Delete"
        cancelText="Cancel"
      >
        <Button type="text" size="small" danger>
          Delete
        </Button>
      </Popconfirm>
    }
  >
    <Row gutter={[8, 0]}>
      <Col span={24}>
        <Form.Item
          name={[props.field.name, "name"]}
          fieldKey={[props.field.fieldKey, "name"]}
          rules={[FORM_RULES.requiredRule]}
          label="Name"
        >
          <Input />
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={[8, 0]}>
      <Col span={24}>
        <Form.Item
          name={[props.field.name, "description"]}
          fieldKey={[props.field.fieldKey, "description"]}
          rules={[FORM_RULES.requiredRule]}
          label="Description"
        >
          <TextArea rows={3} />
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={[8, 0]}>
      <Col xs={24} sm={12}>
        <Form.Item
          name={[props.field.name, "minScore"]}
          fieldKey={[props.field.fieldKey, "minScore"]}
          rules={[FORM_RULES.requiredRule]}
          label="Min Score"
        >
          <InputNumber type="number" precision={0} style={{ width: "100%" }} />
        </Form.Item>
      </Col>

      <Col xs={24} sm={12}>
        <Form.Item
          name={[props.field.name, "maxScore"]}
          fieldKey={[props.field.fieldKey, "maxScore"]}
          rules={[FORM_RULES.requiredRule]}
          label="Max Score"
        >
          <InputNumber type="number" precision={0} style={{ width: "100%" }} />
        </Form.Item>
      </Col>
    </Row>
  </Card>
);

export default CriteriaModalCard;
