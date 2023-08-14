import React, { useState } from "react";
import { Button, List, Typography, Input, Select } from "antd";
import { Alert, AlertIcon, Box, Flex } from "@chakra-ui/react";
import { ListGridType } from "antd/lib/list";
import useAxios from "axios-hooks";
import { apiUrl, Service } from "@hex-labs/core";

import { FormModalProps, ModalState } from "../../util/FormModalProps";
import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";
import { User } from "../../types/User";
import { useCurrentHexathon } from "../../contexts/CurrentHexathonContext";

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
  const CurrentHexathonContext = useCurrentHexathon();
  const { currentHexathon } = CurrentHexathonContext;
  const [modalState, setModalState] = useState({
    visible: false,
    initialValues: null,
  } as ModalState);
  const [searchText, setSearchText] = useState("");
  const [isJudging, setIsJudging] = useState<any>(undefined);

  const [{ loading, data, error }, refetch] = useAxios({
    method: "GET",
    url: apiUrl(Service.EXPO, props.queryUrl),
    params: {
      hexathon: currentHexathon.id,
    },
  });

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

  const judgingOptions = [
    { value: "true", label: "Is Judging" },
    { value: "false", label: "Is Not Judging" },
  ];

  updatedData = isJudging
    ? updatedData.filter((user: User) => user.isJudging.toString() === isJudging)
    : updatedData;

  const Modal = props.modal;

  return (
    <>
      <Flex>
        <Title level={3}>{props.title}</Title>
      </Flex>

      {(props.title=="Categories") && (
        <Box paddingBottom={2}>
          <Alert status='info'>
            <AlertIcon />
            Categories are prizes or awards that hackathon submissions can win. 
            For example, “Best Overall”  or “T-Mobile Winner” or “Best Design”. Categories belong 
            to category groups for judging organization purposes.
          </Alert>
        </Box>
      )}


      {(props.title=="Category Groups") && (
        <Box paddingBottom={2}>
          <Alert status='info'>
            <AlertIcon />
            Category Groups are internal identifiers for judging purposes where each judge is assigned a category 
            group to review. For example, let’s say we need a T-Mobile judge that should be designated to judge 
            all projects that have been submitted for a T-Mobile project. A category group would be created to 
            handle this grouping and would be assigned to the respective judge.
          </Alert>
        </Box>
      )}
      <Search
        placeholder="Search"
        style={{ width: "300px" }}
        value={searchText}
        onChange={event => setSearchText(event.target.value)}
      />
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
          pageSize: 15,
        }}
      />
      <Modal modalState={modalState} setModalState={setModalState} refetch={refetch} />
    </>
  );
};

export default AdminContentList;
