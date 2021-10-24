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
  {
    title: "Edit Score",
    dataIndex: "editScore",
    key: "editScore",
  },
  {
    title: "Delete Score",
    dataIndex: "deleteScore",
    key: "deleteScore",
  },
];

type ProjectTableType = {
  data: any;
};

const ProjectTable = ({ data }: ProjectTableType) => (
  <Table columns={columns} dataSource={data} pagination={false} size="small" />
);

export default ProjectTable;
