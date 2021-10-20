import React, { useState } from "react";
import { Button, List, Typography, Input } from "antd";
import { ListGridType } from "antd/lib/list";
import useAxios from "axios-hooks";

import { FormModalProps, ModalState } from "../../util/FormModalProps";
import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";

const { Title } = Typography;
const { Search } = Input;

interface Props {
  title: string;
  queryUrl: string;
  sortData: (data: any) => any;
  modal: React.FC<FormModalProps>;
  hideAddButton?: boolean;
  searchFilterField: string;
  renderItem: (item: any, index: number, openModal: (values: any) => void) => React.ReactNode;
  listGrid?: ListGridType;
  listBordered?: boolean;
}

const AdminContentList: React.FC<Props> = props => {
  const [modalState, setModalState] = useState({
    visible: false,
    initialValues: null,
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
      <Search
        placeholder="Search"
        style={{ width: "300px" }}
        value={searchText}
        onChange={event => setSearchText(event.target.value)}
      />
      {!props.hideAddButton && (
        <Button style={{ marginLeft: "10px" }} onClick={() => openModal(null)}>
          Add +
        </Button>
      )}
      <List
        loading={loading}
        dataSource={updatedData}
        style={{ margin: "15px auto 0 auto" }}
        renderItem={(item: any, index: any) => props.renderItem(item, index, openModal)}
        grid={props.listGrid}
        bordered={props.listBordered}
      />
      <Modal modalState={modalState} setModalState={setModalState} refetch={refetch} />
    </>
  );
};

export default AdminContentList;
