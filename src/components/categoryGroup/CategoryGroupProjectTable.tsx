import { Table } from "antd";
import React from "react";

const columns = [
  {
    title: "Judge",
    dataIndex: "judge",
    key: "judge",
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
  },
];

type ProjectTableType = {
  data: any;
};

const CategoryGroupProjectTable = ({ data }: ProjectTableType) => (
  <Table columns={columns} dataSource={data} pagination={false} size="small" />
);

export default CategoryGroupProjectTable;
