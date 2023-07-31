import React from "react";
import { Typography, Layout, Menu, Button, List, Tag } from "antd";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import {
  UserOutlined,
  SettingOutlined,
  ContainerOutlined,
  FolderOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { Alert, AlertIcon, AlertDescription, CloseButton, Flex } from "@chakra-ui/react";

import AdminContentList from "./AdminContentList";
import UserFormModal from "./panes/users/UserFormModal";
import ConfigEditPane from "./panes/config/ConfigEditPane";
import CategoryGroupFormModal from "./panes/categorygroups/CategoryGroupFormModal";
import CategoryFormModal from "./panes/categories/CategoryModal";
import TableGroupsModal from "./panes/tableGroups/TableGroupsModal";
import CategoryCard from "./panes/categories/CategoryCard";

const { Title, Text } = Typography;
const { Sider, Content } = Layout;

const AdminHome: React.FC = () => {
  const paneKeys = ["config", "users", "categories", "categorygroups", "tablegroups"];
  const { activePane } = useParams<any>();
  const navigate = useNavigate();

  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const handleComponentClick = (index: number) => {
    setSelectedIndex(index);
    setIsOpen(true);
  };
  const closeAlert = () => {
    setIsOpen(false);
  };

  if (!paneKeys.includes(activePane ?? "")) {
    return <Navigate to={`/admin/${paneKeys[0]}`} />;
  }

  let content = null;

  switch (activePane) {
    case "config":
      content = <ConfigEditPane />;
      break;
    case "users":
      content = (
        <AdminContentList
          queryUrl="/user"
          title="Users"
          sortData={data => data.concat().sort((a: any, b: any) => b.name - a.name)}
          modal={UserFormModal}
          searchFilterField="name"
          userRoleFilterField="general"
          showSortUsersByRoleButton
          hideAddButton
          renderItem={(item, index, openModal) => (
            <List.Item style={{ backgroundColor: "white" }}>
              <List.Item.Meta
                title={`${item.name} (${item.email})`}
                description={
                  <div>
                    <Flex>
                      <Text style={{ display: "block", paddingRight: "10px", }}>
                        Category Group: {item.categoryGroup?.name || "N/A"}
                      </Text>
                      <Text style={
                        { display: "block", 
                          fontSize: 12, 
                          color:"blue",
                          cursor: "pointer",
                          textDecoration: "underline",
                        }} 
                        onClick={() => handleComponentClick(index)}>
                        What is this?
                      </Text>
                    </Flex>
                    {(selectedIndex==index) && (isOpen) && (
                      <Alert status='info' variant='subtle' size='xs' mt={2} mb={2}>
                        <AlertIcon />
                        <AlertDescription mr={8}>
                          {item.categoryGroup?.name || "This"} is a category group. Category Groups are internal identifiers 
                          for judging purposes where each judge is assigned a category group to review. For example, 
                          say we need a T-Mobile judge that should be designated to judge all projects that have been 
                          submitted for a T-Mobile project. A category group would be created to handle this grouping 
                          and would be assigned to the respective judge.
                        </AlertDescription>
                        <CloseButton position="absolute" right="8px" top="8px" onClick={closeAlert}/>
                      </Alert>
                    )}
                    <div>
                      <Tag>{item.role}</Tag>
                      {item.isJudging && <Tag>Judging</Tag>}
                    </div>
                  </div>
                }
                avatar={<UserOutlined />}
              />
              <Button onClick={() => openModal(item)}>Edit</Button>
            </List.Item>
          )}
          key="users"
          listBordered
        />
      );
      break;
    case "categories":
      content = (
        <AdminContentList
          queryUrl="/categories"
          title="Categories"
          sortData={data => data.concat().sort((a: any, b: any) => b.name - a.name)}
          modal={CategoryFormModal}
          searchFilterField="name"
          userRoleFilterField="general"
          renderItem={(item, index, openModal) => (
            <List.Item style={{ backgroundColor: "white" }}>
              <List.Item.Meta
                title={item.name}
                description={item.criterias
                  .map(
                    (criteria: any) =>
                      `${criteria.name} [${criteria.minScore}-${criteria.maxScore}]`
                  )
                  .join(", ")}
                avatar={<ContainerOutlined />}
              />
              <Button onClick={() => openModal(item)}>Edit</Button>
            </List.Item>
          )}
          key="categories"
          listBordered
        />
      );
      break;
    case "categorygroups":
      content = (
        <AdminContentList
          queryUrl="/categorygroups"
          title="Category Groups"
          sortData={data => data.concat().sort((a: any, b: any) => b.name - a.name)}
          modal={CategoryGroupFormModal}
          searchFilterField="name"
          userRoleFilterField="general"
          renderItem={(item, index, openModal) => (
            <List.Item style={{ backgroundColor: "white" }}>
              <List.Item.Meta
                title={item.name}
                description={item.categories.map((category: any) => category.name).join(", ")}
                avatar={<FolderOutlined />}
              />
              <Button onClick={() => openModal(item)}>Edit</Button>
            </List.Item>
          )}
          key="categorygroups"
          listBordered
        />
      );
      break;
    case "tablegroups":
      content = (
        <AdminContentList
          queryUrl="/tablegroups"
          title="Table Groups"
          sortData={data => data.concat().sort((a: any, b: any) => b.name - a.name)}
          modal={TableGroupsModal}
          searchFilterField="name"
          userRoleFilterField="general"
          renderItem={(item, index, openModal) => (
            <List.Item style={{ backgroundColor: "white" }}>
              <List.Item.Meta
                title={item.name}
                description={`[${item.shortCode}] - ${item.color}`}
                avatar={<TableOutlined />}
              />
              <Button onClick={() => openModal(item)}>Edit</Button>
            </List.Item>
          )}
          key="tablegroups"
          listBordered
        />
      );
      break;
  }

  const handleMenuClick = (event: any) => {
    navigate(`/admin/${event.key}`);
  };

  return (
    <>
      <Title>Admin Panel</Title>
      <Layout className="ant-layout-has-sider">
        <Sider
          breakpoint="md"
          collapsedWidth="0"
          width={200}
          theme="dark"
          className="site-layout-background"
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={["config"]}
            selectedKeys={[activePane ?? ""]}
            style={{ height: "100%", borderRight: 0 }}
            onClick={handleMenuClick}
          >
            <Menu.Item key="config" icon={<SettingOutlined />}>
              Config
            </Menu.Item>
            <Menu.Item key="users" icon={<UserOutlined />}>
              Users
            </Menu.Item>
            <Menu.Item key="categories" icon={<ContainerOutlined />}>
              Categories
            </Menu.Item>
            <Menu.Item key="categorygroups" icon={<FolderOutlined />}>
              Category Groups
            </Menu.Item>
            <Menu.Item key="tablegroups" icon={<TableOutlined />}>
              Table Groups
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 500,
            }}
          >
            {content}
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default AdminHome;
