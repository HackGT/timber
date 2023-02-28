import React, { useState } from "react";
import { List, Button, Typography, Divider, Input, Row, Col, Select } from "antd";
import useAxios from "axios-hooks";
import axios from "axios";
import DownloadOutlined from "@ant-design/icons/lib/icons/DownloadOutlined";
import { apiUrl, Service } from "@hex-labs/core";

import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";
import WinnerCard from "./WinnerCard";
import { ModalState } from "../../util/FormModalProps";
import WinnerEditFormModal from "./WinnerEditFormModal";
import { Category } from "../../types/Category";

const { Title } = Typography;
const { Search } = Input;

const handleDownload = async () => {
  await axios
    .get(apiUrl(Service.EXPO, "/winner/export"), { responseType: "blob" })
    .then(response => {
      const href = URL.createObjectURL(response.data);

      // create "a" HTML element with href to file & click
      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("download", "Winners.csv");
      document.body.appendChild(link);
      link.click();

      // clean up "a" element & remove ObjectURL
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    });
};

const Winners: React.FC = () => {
  const [modalState, setModalState] = useState({
    visible: false,
    initialValues: null,
  } as ModalState);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<any>(undefined);

  const openModal = (values: any) => {
    setModalState({
      visible: true,
      initialValues: { ...values },
    });
  };

  const [{ loading: winnersLoading, data: winnersData, error: winnersError }, refetch] = useAxios(
    apiUrl(Service.EXPO, "/winner")
  );
  const [{ loading: categoriesLoading, data: categoriesData, error: categoriesError }] = useAxios(
    apiUrl(Service.EXPO, "/categories")
  );

  if (winnersLoading || categoriesLoading) {
    return <LoadingDisplay />;
  }
  if (winnersError || categoriesError) {
    return <ErrorDisplay error={winnersError} />;
  }

  let updatedData = winnersData
    ? winnersData.filter((winner: any) =>
        winner.project.name.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  updatedData = selectedCategory
    ? updatedData.filter((winner: any) => winner.category.id === selectedCategory)
    : updatedData;

  const categoryOptions = categoriesData
    ? categoriesData.map((category: Category) => ({
        label: category.name,
        value: category.id,
      }))
    : [];

  return (
    <>
      <Title level={2}>Winners</Title>
      <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownload}>
        Download
      </Button>
      <Divider />

      <Row gutter={[8, 8]} style={{ marginBottom: "20px" }}>
        <Col xs={24} sm={8} md={5}>
          <Search
            placeholder="Search"
            value={searchText}
            onChange={event => setSearchText(event.target.value)}
          />
        </Col>
        <Col xs={24} sm={16} md={5}>
          <Select
            placeholder="Filter by Category"
            style={{ width: "100%" }}
            options={categoryOptions}
            optionFilterProp="label"
            onChange={value => setSelectedCategory(value)}
            allowClear
          />
        </Col>
      </Row>

      <div>
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
          loading={winnersLoading}
          dataSource={updatedData}
          renderItem={(winner: any) => (
            <List.Item>
              <WinnerCard
                id={winner.id}
                project={winner.project}
                category={winner.category}
                members={winner.project.members}
                rank={winner.rank}
                onClick={() => openModal(winner)}
              />
            </List.Item>
          )}
        />
      </div>
      <WinnerEditFormModal
        modalState={modalState}
        setModalState={setModalState}
        refetch={refetch}
      />
    </>
  );
};

export default Winners;
