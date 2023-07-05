import React, { useState } from "react";
import {
  Button,
  List,
  Typography,
  Input,
  Col,
  Select,
  Tag,
  Dropdown,
  Checkbox,
  Pagination,
  PaginationProps,
} from "antd";
import { Text, Alert, AlertIcon, AlertDescription, CloseButton, IconButton, Flex } from "@chakra-ui/react";
import { ListGridType } from "antd/lib/list";
import useAxios from "axios-hooks";

import { FormModalProps, ModalState } from "../../util/FormModalProps";
import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";
import { User } from "../../types/User";
import { apiUrl, Service } from "@hex-labs/core";
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
  const [userRole, setUserRole] = useState<any>(undefined);
  const [isJudging, setIsJudging] = useState<any>(undefined);

  const [isOpen, setIsOpen] = useState(false);
  const openAlert = () => {
    setIsOpen(true);
  };
  const closeAlert = () => {
    setIsOpen(false);
  };

  const [{ loading, data, error }, refetch] = useAxios({
    method: "GET",
    url: apiUrl(Service.EXPO, props.queryUrl),
    params: {
      hexathon: currentHexathon.id
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

  const userRoleOptions = [
    { value: "GENERAL", label: "General" },
    { value: "SPONSOR", label: "Sponsor" },
    { value: "ADMIN", label: "Admin" },
  ];

  updatedData = userRole ? updatedData.filter((user: User) => user.role == userRole) : updatedData;

  const judgingOptions = [
    { value: "true", label: "Is Judging" },
    { value: "false", label: "Is Not Judging" },
  ];

  updatedData = isJudging
    ? updatedData.filter((user: User) => user.isJudging.toString() == isJudging)
    : updatedData;

  const Modal = props.modal;

  return (
    <>
      <Flex>
        <Title level={3}>{props.title}</Title>

        {(props.title=="Categories" || props.title=="Category Groups") && 
        (<Text pl={2} pt={2} pb={0} fontSize="xs" color="blue.500" _hover={{ cursor: "pointer", textDecoration: "underline" }} onClick={openAlert}>
          What is this?
        </Text>
        )}
      </Flex>
        {isOpen && (props.title=="Categories") && (
          <Alert status='info' variant='subtle' size='xs' mt={0} mb={2}>
            <AlertIcon />
            {/* <AlertTitle>Information</AlertTitle> */}
            <AlertDescription mr={8}>
              Categories are prizes or awards that hackathon submissions can win. 
              For example, “Best Overall”  or “T-Mobile Winner” or “Best Design”. Categories belong 
              to category groups for judging organization purposes.
            </AlertDescription>
            <CloseButton position="absolute" right="8px" top="8px" onClick={closeAlert} />
          </Alert>
        )}

        {isOpen && (props.title=="Category Groups") && (
          <Alert status='info' variant='subtle' size='xs' mt={0} mb={2}>
            <AlertIcon />
            {/* <AlertTitle>Information</AlertTitle> */}
            <AlertDescription mr={8}>
            Category Groups are internal identifiers for judging purposes where each judge is assigned a category 
            group to review. For example, let’s say we need a T-Mobile judge that should be designated to judge 
            all projects that have been submitted for a T-Mobile project. A category group would be created to 
            handle this grouping and would be assigned to the respective judge.
            </AlertDescription>
            <CloseButton position="absolute" right="8px" top="8px" onClick={closeAlert} />
          </Alert>
        )}
      <Search
        placeholder="Search"
        style={{ width: "300px" }}
        value={searchText}
        onChange={event => setSearchText(event.target.value)}
      />
      {props.showSortUsersByRoleButton && (
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
          pageSize: 15,
        }}
      />
      <Modal modalState={modalState} setModalState={setModalState} refetch={refetch} />
    </>
  );
};

export default AdminContentList;
