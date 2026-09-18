import React, { useEffect, useRef } from "react";
import { Button, Form, Input, message, Modal, Select, Popconfirm, Switch } from "antd";
import axios from "axios";
import useAxios from "axios-hooks";
import { apiUrl, Service } from "@hex-labs/core";

import { FORM_RULES, handleAxiosError } from "../../../../util/util";
import { FormModalProps } from "../../../../util/FormModalProps";
import ErrorDisplay from "../../../../displays/ErrorDisplay";
import LoadingDisplay from "../../../../displays/LoadingDisplay";
import { useCurrentHexathon } from "../../../../contexts/CurrentHexathonContext";

const CategoryGroupFormModal: React.FC<FormModalProps> = props => {
  const CurrentHexathonContext = useCurrentHexathon();
  const { currentHexathon } = CurrentHexathonContext;

  const [{ loading: userLoading, data: userData, error: userError }] = useAxios(
    apiUrl(Service.EXPO, "/users")
  );

  const [{ loading: categoriesLoading, data: categoriesData, error: categoriesError }] = useAxios({
    method: "GET",
    url: apiUrl(Service.EXPO, "/categories"),
    params: {
      hexathon: currentHexathon?.id,
    },
  });

  const originalUserIds = useRef<number[]>([]);

  const [form] = Form.useForm();
  useEffect(() => {
    if (props.modalState.initialValues) {
      originalUserIds.current = props.modalState.initialValues.users.map((u: any) => u.id);
      form.setFieldsValue({
        ...props.modalState.initialValues,
        categories: props.modalState.initialValues?.categories.map((category: any) => category.id),
        users: props.modalState.initialValues?.users.map((user: any) => user.id),
      });
    } else {
      originalUserIds.current = [];
      form.resetFields();
    }
  }, [form, props.modalState.initialValues]); // github.com/ant-design/ant-design/issues/22372

  if (userLoading || categoriesLoading) {
    return <LoadingDisplay />;
  }

  if (userError || categoriesError) {
    return <ErrorDisplay error={userError} />;
  }

  const onDelete = async () => {
    axios
      .delete(apiUrl(Service.EXPO, `/category-groups/${props.modalState.initialValues.id}`))
      .then(res => {
        message.success("Category group successfully deleted", 2);
        props.setModalState({ visible: false, initialValues: null });
        props.refetch();
      })
      .catch(err => {
        handleAxiosError(err);
      });
  };

  const syncJudges = async (groupId: number, newUserIds: number[]) => {
    const toAdd = newUserIds.filter(id => !originalUserIds.current.includes(id));
    const toRemove = originalUserIds.current.filter(id => !newUserIds.includes(id));

    const requests = [
      ...toAdd.map(userId => ({ userId, promise: axios.post(apiUrl(Service.EXPO, `/category-groups/${groupId}/judges`), { userId }) })),
      ...toRemove.map(userId => ({ userId, promise: axios.delete(apiUrl(Service.EXPO, `/category-groups/${groupId}/judges/${userId}`)) })),
    ];

    const results = await Promise.allSettled(requests.map(r => r.promise));

    const failedNames = results
      .map((result, i) => ({ result, userId: requests[i].userId }))
      .filter(({ result }) => result.status === "rejected")
      .map(({ result, userId }) => {
        const name = userData.find((u: any) => u.id === userId)?.name ?? `User ${userId}`;
        const reason = (result as PromiseRejectedResult).reason?.response?.data?.message ?? "unknown error";
        return `${name} (${reason})`;
      });

    if (failedNames.length > 0) {
      message.error(`Failed to update judges: ${failedNames.join(", ")}`, 5);
    }
  };

  const onSubmit = async () => {
    try {
      const { users: newUserIds = [], ...groupValues } = await form.validateFields();
      const hide = message.loading("Loading...", 0);

      if (props.modalState.initialValues) {
        axios
          .patch(
            apiUrl(Service.EXPO, `/category-groups/${props.modalState.initialValues.id}`),
            groupValues
          )
          .then(async res => {
            await syncJudges(props.modalState.initialValues.id, newUserIds);
            hide();
            message.success("Category group successfully updated", 2);
            props.setModalState({ visible: false, initialValues: null });
            props.refetch();
          })
          .catch(err => {
            hide();
            handleAxiosError(err);
          });
      } else {
        axios
          .post(apiUrl(Service.EXPO, `/category-groups`), groupValues)
          .then(async res => {
            await syncJudges(res.data.id, newUserIds);
            hide();
            message.success("Category group successfully created", 2);
            props.setModalState({ visible: false, initialValues: null });
            props.refetch();
          })
          .catch(err => {
            hide();
            handleAxiosError(err);
          });
      }
    } catch (error) {
      console.log("Validate Failed:", error);
    }
  };

  const categoryOptions = categoriesLoading
    ? []
    : categoriesData.map((category: any) => ({
        label: category.name,
        value: category.id,
      }));

  const userOptions = userLoading
    ? []
    : userData.map((user: any) => ({
        label: `${user.name} [${user.email}]`,
        value: user.id,
      }));

  return (
    <Modal
      visible={props.modalState.visible}
      title={props.modalState.initialValues ? `Manage Category Group` : `Create Category Group`}
      okText={props.modalState.initialValues ? "Update" : "Create"}
      onCancel={() => props.setModalState({ visible: false, initialValues: null })}
      cancelText="Cancel"
      footer={[
        props.modalState.initialValues && (
          <Popconfirm key="delete"
            title="Are you sure you want to delete this category group?"
            onConfirm={onDelete}
            okText="Yes"
            cancelText="No"
          >
            <Button danger style={{ float: "left" }}>
              Delete
            </Button>
          </Popconfirm>
        ),
        <Button
          key="2"
          onClick={() => props.setModalState({ visible: false, initialValues: null })}
        >
          Cancel
        </Button>,
        <Button key="1" onClick={onSubmit} type="primary">
          {props.modalState.initialValues ? "Update" : "Create"}
        </Button>,
      ]}
      bodyStyle={{ paddingBottom: 0 }}
    >
      <Form form={form} layout="vertical" autoComplete="off">
        <Form.Item name="name" rules={[FORM_RULES.requiredRule]} label="Name">
          <Input />
        </Form.Item>
        <Form.Item name="categories" label="Categories">
          <Select
            mode="multiple"
            options={categoryOptions}
            optionFilterProp="label"
            loading={categoriesLoading}
          />
        </Form.Item>
        <Form.Item name="users" label="Users">
          <Select
            mode="multiple"
            options={userOptions}
            optionFilterProp="label"
            loading={userLoading}
          />
        </Form.Item>
        <Form.Item name="isSponsor" label="Is Sponsor Category Group" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryGroupFormModal;
