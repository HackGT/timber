import React from "react";
import { Typography, Tag, Tabs } from "antd";
import { useParams, useHistory } from "react-router-dom";

import AdminContentList from "./AdminContentList";
import UserFormModal from "./modals/UserFormModal";
import CategoryList from "./modals/CategoryList";
import ConfigEditContainer from "./ConfigEditContainer";
import Judging from "./Judging";

const { Title } = Typography;
const { TabPane } = Tabs;

const AdminHome: React.FC = () => {
  const { activeTab } = useParams<any>();
  const history = useHistory();

  const tabKeys = ["users", "categories"];

  if (!tabKeys.includes(activeTab)) {
    history.replace(`/admin/${tabKeys[0]}`);
  }

  return (
    <>
      <Title>Admin Panel</Title>
      <ConfigEditContainer />
      <Tabs
        activeKey={activeTab}
        defaultActiveKey="users"
        onTabClick={key => history.push(`/admin/${key}`)}
      >
        <TabPane tab="Users" key={tabKeys[0]}>
          <AdminContentList
            queryUrl="/user"
            title="Users"
            tag={item => <Tag>{item.role}</Tag>}
            sortData={data => data.concat().sort((a: any, b: any) => b.name - a.name)}
            name={item => `${item.name} (${item.email})`}
            modal={UserFormModal}
            searchFilterField="name"
            hideAddButton
          />
        </TabPane>
        <TabPane tab="Categories" key={tabKeys[1]}>
          <CategoryList />
        </TabPane>
      </Tabs>

      <Title>Judging</Title>
      <Judging />
    </>
  );
};

export default AdminHome;
