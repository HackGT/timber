import React, { useState } from "react";
import { Button, List, Typography, Input, Col, Select, Tag, Dropdown, Checkbox, Pagination, PaginationProps } from "antd";
import { ListGridType } from "antd/lib/list";
import useAxios from "axios-hooks";

import { FormModalProps, ModalState } from "../../util/FormModalProps";
import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";
import { User } from "../../types/User";

const { Title } = Typography;
const { Search } = Input;

interface Props {
  title: string;
  queryUrl: string;
  sortData: (data: any) => any;
  modal: React.FC<FormModalProps>;
  showSortUsersByRoleButton?: boolean;
  showIsJudging?: boolean;
  hideAddButton?: boolean;
  searchFilterField: string;
  userRoleFilterField: string;
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
  const [userRole, setUserRole] = useState<any>(undefined);
  const [isJudging, setIsJudging] = useState<any>(undefined);

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

  let updatedData = data
    ? props
        .sortData(data)
        .filter((item: any) =>
          item[props.searchFilterField].toLowerCase().includes(searchText.toLowerCase())
        )
    : [];

    const userRoleOptions = [
      { value: 'GENERAL', label: 'General' },
      { value: 'SPONSOR', label: 'Sponsor' },
      { value: 'ADMIN', label: 'Admin' }
    ]

    updatedData = userRole
      ? updatedData.filter((user: User) =>
          user.role == userRole
        )
      : updatedData;

    const judgingOptions = [
      { value: 'true', label: 'Is Judging' },
      { value: 'false', label: 'Is Not Judging' }
    ]

    updatedData = isJudging
      ? 
      updatedData.filter((user: User) =>
          (user.isJudging).toString() == isJudging 
        )
      : updatedData;

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
      { props.showSortUsersByRoleButton && (
        <Select
          placeholder="Filter by User Role"
          style={{ width: "300px" }}
          optionFilterProp="label1"
          onChange={(value: any) => setUserRole(value)}
          options={userRoleOptions}
          allowClear
        />
      )}
      {props.showSortUsersByRoleButton && (
        <Select
          placeholder="Filter by Judging"
          style={{ width: "300px" }}
          optionFilterProp="label2"
          onChange={(value: any) => setIsJudging(value)}
          options={judgingOptions}
          allowClear
        />
      )}
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
        pagination={{
          pageSize: 15
        }}
      />
      <Modal modalState={modalState} setModalState={setModalState} refetch={refetch} />
    </>
  );
};

export default AdminContentList;