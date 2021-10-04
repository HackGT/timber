import React, { useState } from "react";
import { Button, List, Typography, Input } from "antd";
import useAxios from "axios-hooks";

import { FormModalProps, ModalState } from "./FormModalProps";
import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";

const { Title, Text } = Typography;
const { Search } = Input;

interface Props {
  title: string;
  queryUrl: string;
  tag?: (item: any) => JSX.Element;
  sortData: (data: any) => any;
  name: (item: any) => string;
  modal: React.FC<FormModalProps>;
  hideAddButton?: boolean;
  searchFilterField: string;
}

const AdminContentList: React.FC<Props> = props => {
  const [modalState, setModalState] = useState({
    visible: false,
    initialValues: null
  } as ModalState);
  const [searchText, setSearchText] = useState("");

  const [{ loading, data, error }, refetch] = useAxios(props.queryUrl);

  const openModal = (values: any) => {
    setModalState({
      visible: true,
      initialValues: values,
    });
  };

  if (loading) {
    return <LoadingDisplay />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  const updatedData = data
    ? props
        .sortData(data)
        .filter((item: any) =>
          item[props.searchFilterField].toLowerCase().includes(searchText.toLowerCase())
        )
    : [];

  const Modal = props.modal;

  return (
    <>
      <Title level={3}>{props.title}</Title>
      {!props.hideAddButton && (
        <Button style={{ marginRight: "10px" }} onClick={() => openModal(null)}>
          Add +
        </Button>
      )}
      <Search
        placeholder="Search"
        style={{ width: "200px" }}
        value={searchText}
        onChange={event => setSearchText(event.target.value)}
      />
      <List
        bordered
        loading={loading}
        dataSource={updatedData}
        style={{ maxWidth: "800px", margin: "15px auto 0 auto" }}
        renderItem={(item: any) => (
          <List.Item>
            {props.tag ? props.tag(item) : <div />}
            <Text style={{ textAlign: "center", maxWidth: "33%", wordBreak: "break-word" }}>
              {props.name(item)}
            </Text>
            <Button onClick={() => openModal(item)}>Edit</Button>
          </List.Item>
        )}
      />
      <Modal modalState={modalState} setModalState={setModalState} refetch={refetch} />
    </>
  );
};

export default AdminContentList;
