import React, { useState } from "react";
import { Typography, Button, Table, message, Alert, Tag, Popconfirm } from "antd";
import { Box } from "@chakra-ui/react";
import useAxios from "axios-hooks";
import axios from "axios";
import { apiUrl, Service } from "@hex-labs/core";

import ErrorDisplay from "../../../../displays/ErrorDisplay";
import LoadingDisplay from "../../../../displays/LoadingDisplay";
import { useCurrentHexathon } from "../../../../contexts/CurrentHexathonContext";
import { handleAxiosError } from "../../../../util/util";

const { Title } = Typography;

const JudgeDistributionPane: React.FC = () => {
  const { currentHexathon } = useCurrentHexathon();
  const [distributing, setDistributing] = useState(false);
  const [resetting, setResetting] = useState(false);

  const [{ loading: cgLoading, data: cgData, error: cgError }] = useAxios({
    method: "GET",
    url: apiUrl(Service.EXPO, "/category-groups"),
    params: { hexathon: currentHexathon?.id },
  });

  const [{ loading: tgLoading, data: tgData, error: tgError }] = useAxios({
    method: "GET",
    url: apiUrl(Service.EXPO, "/table-groups"),
    params: { hexathon: currentHexathon?.id },
  });

  const [{ loading: sessLoading, data: sessData, error: sessError }, refetchSessions] = useAxios({
    method: "GET",
    url: apiUrl(Service.EXPO, "/judging-sessions"),
    params: { hexathon: currentHexathon?.id },
  });

  if (cgLoading || tgLoading || sessLoading) return <LoadingDisplay />;
  if (cgError || tgError || sessError) return <ErrorDisplay error={cgError || tgError || sessError} />;

  const tableGroupMap = new Map<number, string>();
  tgData?.forEach((tg: any) => tableGroupMap.set(tg.id, tg.name));

  // Build a map of userId → judge name from category groups data
  const userNameMap = new Map<number, string>();
  cgData?.forEach((cg: any) => {
    cg.users?.forEach((u: any) => userNameMap.set(u.id, u.name));
  });

  const handleReset = async () => {
    setResetting(true);
    const hide = message.loading("Resetting all judging state...", 0);
    try {
      await axios.post(apiUrl(Service.EXPO, "/assignments/reset-judging"));
      hide();
      message.success("All judging state has been reset", 3);
      refetchSessions();
    } catch (err: any) {
      hide();
      handleAxiosError(err);
    } finally {
      setResetting(false);
    }
  };

  const handleDistribute = async () => {
    setDistributing(true);
    const hide = message.loading("Distributing judges across rooms...", 0);
    try {
      const response = await axios.post(
        apiUrl(Service.EXPO, "/assignments/distribute-judges")
      );
      hide();
      message.success(`Successfully distributed ${response.data.distributed} judges`, 3);
      refetchSessions();
    } catch (err: any) {
      hide();
      handleAxiosError(err);
    } finally {
      setDistributing(false);
    }
  };

  // Build summary: for each category group, show judge count and room assignments
  const summaryData = cgData?.map((cg: any) => ({
    key: cg.id,
    name: cg.name,
    isSponsor: cg.isSponsor,
    judgeCount: cg.users?.length ?? 0,
    categories: cg.categories?.map((c: any) => c.name).join(", ") || "None",
    judges: cg.users?.map((u: any) => u.name).join(", ") || "None",
  })) ?? [];

  const columns = [
    {
      title: "Category Group",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: any) => (
        <>
          <strong>{name}</strong>
          {record.isSponsor && (
            <Tag color="orange" style={{ marginLeft: 8 }}>Sponsor</Tag>
          )}
        </>
      ),
    },
    {
      title: "Categories",
      dataIndex: "categories",
      key: "categories",
    },
    {
      title: "Judges",
      dataIndex: "judgeCount",
      key: "judgeCount",
    },
    {
      title: "Judge Names",
      dataIndex: "judges",
      key: "judges",
      ellipsis: true,
    },
  ];

  // Sessions table — shows persisted data from DB
  const sessions: any[] = sessData ?? [];

  const sessionData = sessions.map((s: any) => ({
    key: s.id,
    userId: s.userId,
    judgeName: userNameMap.get(s.userId) ?? `User ${s.userId}`,
    currentTableGroupId: s.currentTableGroupId,
    roomSwitchCount: s.roomSwitchCount,
  }));

  const sessionColumns = [
    {
      title: "Judge",
      dataIndex: "judgeName",
      key: "judgeName",
    },
    {
      title: "Assigned Room",
      dataIndex: "currentTableGroupId",
      key: "currentTableGroupId",
      render: (id: number) => tableGroupMap.get(id) ?? (id != null ? `Room ${id}` : "None"),
    },
    {
      title: "Room Switches",
      dataIndex: "roomSwitchCount",
      key: "roomSwitchCount",
    },
  ];

  return (
    <>
      <Title level={3}>Judge Distribution</Title>
      <Box paddingBottom={4}>
        <Alert
          message="Distribute judges across rooms proportionally based on how many eligible projects are in each room for their category group. This should be done before judging starts."
          type="info"
          showIcon
        />
      </Box>

      <Title level={4}>Category Groups Overview</Title>
      <Table
        dataSource={summaryData}
        columns={columns}
        pagination={false}
        size="small"
        style={{ marginBottom: 24 }}
      />

      <Title level={4}>Rooms</Title>
      <Box mb={4}>
        {tgData?.map((tg: any) => (
          <Tag key={tg.id} style={{ marginBottom: 4 }}>
            {tg.name} (capacity: {tg.tableCapacity})
          </Tag>
        ))}
      </Box>

      <Box display="flex" gap={3}>
        <Popconfirm
          title="This will reset all existing judge room assignments. Continue?"
          onConfirm={handleDistribute}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" loading={distributing} size="large">
            Distribute Judges to Rooms
          </Button>
        </Popconfirm>

        <Popconfirm
          title="This will delete ALL assignments, ballots, and judging sessions. This cannot be undone. Continue?"
          onConfirm={handleReset}
          okText="Yes, Reset Everything"
          cancelText="No"
        >
          <Button danger loading={resetting} size="large">
            Reset All Judging
          </Button>
        </Popconfirm>
      </Box>

      {sessionData.length > 0 && (
        <Box mt={4}>
          <Alert
            message={`${sessionData.length} judges distributed across rooms`}
            type="success"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <Table
            dataSource={sessionData}
            columns={sessionColumns}
            pagination={{ pageSize: 20 }}
            size="small"
            rowKey="key"
          />
        </Box>
      )}
    </>
  );
};

export default JudgeDistributionPane;
