import React, { useEffect, useRef } from "react";
import { Typography, Table, Tag, Tooltip } from "antd";
import { Box } from "@chakra-ui/react";
import useAxios from "axios-hooks";
import { apiUrl, Service } from "@hex-labs/core";

import ErrorDisplay from "../../../../displays/ErrorDisplay";
import LoadingDisplay from "../../../../displays/LoadingDisplay";
import { useCurrentHexathon } from "../../../../contexts/CurrentHexathonContext";

const { Title } = Typography;

// Blue scale for projects-per-room heatmap
const HEAT_COLORS = [
  "#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6",
  "#4292c6", "#2171b5", "#08519c", "#08306b",
];

function heatColor(value: number, max: number): string {
  if (max === 0 || value === 0) return "#f7fbff";
  const idx = Math.min(Math.floor((value / max) * (HEAT_COLORS.length - 1)), HEAT_COLORS.length - 1);
  return HEAT_COLORS[idx];
}

// Red → yellow → green scale for judging progress
function judgingStyle(count: number): { bg: string; color: string } {
  if (count === 0) return { bg: "#d9d9d9", color: "#888" };
  if (count === 1) return { bg: "#ff3b30", color: "white" };
  if (count === 2) return { bg: "#ffcc00", color: "#333" };
  return { bg: "#34c759", color: "white" };
}

const JUDGING_LEGEND = [
  { label: "0×", bg: "#d9d9d9", color: "#888" },
  { label: "1×", bg: "#ff3b30", color: "white" },
  { label: "2×", bg: "#ffcc00", color: "#333" },
  { label: "3+×", bg: "#34c759", color: "white" },
];

interface ProjectDotProps {
  count: number;
  name: string;
  table: number;
  room: string;
}

function ProjectDot({ count, name, table, room }: ProjectDotProps) {
  const style = judgingStyle(count);
  const tooltipContent = (
    <div>
      <div style={{ fontWeight: 600, marginBottom: 2 }}>{name}</div>
      <div>Table {table} · {room}</div>
      <div style={{ marginTop: 4 }}>
        Judged <strong>{count}</strong>×
        {count === 0 && " — not yet judged"}
        {count === 1 && " — needs more judges"}
        {count === 2 && " — almost done"}
        {count >= 3 && " — complete"}
      </div>
    </div>
  );
  return (
    <Tooltip title={tooltipContent} mouseEnterDelay={0.1}>
      <div
        style={{
          backgroundColor: style.bg,
          color: style.color,
          width: 28,
          height: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 4,
          fontSize: 11,
          fontWeight: 600,
          cursor: "default",
        }}
      >
        {count}
      </div>
    </Tooltip>
  );
}

const JudgingOverviewPane: React.FC = () => {
  const { currentHexathon } = useCurrentHexathon();

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

  const [{ loading: projLoading, data: projData, error: projError }, refetchProjects] = useAxios({
    method: "GET",
    url: apiUrl(Service.EXPO, "/projects"),
    params: { hexathon: currentHexathon?.id },
  });

  const [{ loading: sessLoading, data: sessData, error: sessError }, refetchSessions] = useAxios({
    method: "GET",
    url: apiUrl(Service.EXPO, "/judging-sessions"),
    params: { hexathon: currentHexathon?.id },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refetchProjects();
      refetchSessions();
    }, 500);
    return () => clearInterval(interval);
  }, [refetchProjects, refetchSessions]);

  const hasLoaded = useRef(false);
  if (projData && sessData && cgData && tgData) hasLoaded.current = true;

  if (!hasLoaded.current && (cgLoading || tgLoading || projLoading || sessLoading)) return <LoadingDisplay />;
  if (cgError || tgError || projError || sessError)
    return <ErrorDisplay error={cgError || tgError || projError || sessError} />;

  const tableGroups: any[] = tgData ?? [];
  const categoryGroups: any[] = cgData ?? [];
  const projects: any[] = projData ?? [];
  const sessions: any[] = sessData ?? [];

  const tgMap = new Map<number, string>();
  tableGroups.forEach((tg: any) => tgMap.set(tg.id, tg.name));

  // ── Projects per Room heatmap ────────────────────────────────────────────
  const heatmapData: { key: number; name: string; isSponsor: boolean; rooms: Record<number, number>; total: number }[] = [];
  let globalMax = 0;

  for (const cg of categoryGroups) {
    const categoryIds = new Set(cg.categories?.map((c: any) => c.id) ?? []);
    const rooms: Record<number, number> = {};
    let total = 0;

    for (const proj of projects) {
      if (proj.categories?.some((c: any) => categoryIds.has(c.id)) && proj.tableGroupId != null) {
        rooms[proj.tableGroupId] = (rooms[proj.tableGroupId] ?? 0) + 1;
        total++;
      }
    }

    for (const count of Object.values(rooms)) {
      if (count > globalMax) globalMax = count;
    }

    heatmapData.push({ key: cg.id, name: cg.name, isSponsor: cg.isSponsor, rooms, total });
  }

  const heatmapColumns = [
    {
      title: "Track",
      dataIndex: "name",
      key: "name",
      fixed: "left" as const,
      width: 160,
      render: (name: string, record: any) => (
        <>
          <strong>{name}</strong>
          {record.isSponsor && <Tag color="orange" style={{ marginLeft: 4 }}>S</Tag>}
        </>
      ),
    },
    ...tableGroups.map((tg: any) => ({
      title: tg.name,
      key: `room-${tg.id}`,
      width: 100,
      align: "center" as const,
      render: (_: any, record: any) => {
        const count = record.rooms[tg.id] ?? 0;
        return (
          <div
            style={{
              backgroundColor: heatColor(count, globalMax),
              color: count > globalMax * 0.6 ? "white" : "#333",
              padding: "4px 8px",
              borderRadius: 4,
              fontWeight: count > 0 ? 600 : 400,
            }}
          >
            {count}
          </div>
        );
      },
    })),
    {
      title: "Total",
      key: "total",
      width: 80,
      align: "center" as const,
      render: (_: any, record: any) => <strong>{record.total}</strong>,
    },
  ];

  // Per-track judging progress (judgments only from judges in that track)
  const cgJudgeCounts = new Map<number, Map<number, number>>();
  for (const cg of categoryGroups) {
    const categoryIds = new Set(cg.categories?.map((c: any) => c.id) ?? []);
    const projCounts = new Map<number, number>();
    cgJudgeCounts.set(cg.id, projCounts);
    for (const s of sessions) {
      for (const a of s.user?.assignments ?? []) {
        if (a.status === "COMPLETED" && a.categoryIds?.some((id: number) => categoryIds.has(id))) {
          projCounts.set(a.projectId, (projCounts.get(a.projectId) ?? 0) + 1);
        }
      }
    }
  }

  // Total judgments per project (across all tracks) for the by-room view
  const projJudgeCounts = new Map<number, number>();
  for (const s of sessions) {
    for (const a of s.user?.assignments ?? []) {
      if (a.status === "COMPLETED") {
        projJudgeCounts.set(a.projectId, (projJudgeCounts.get(a.projectId) ?? 0) + 1);
      }
    }
  }

  // ── Judge stats ──────────────────────────────────────────────────────────
  const judgeStats = sessions.map((s: any) => ({
    key: s.id,
    judgeName: s.user?.name ?? `User ${s.userId}`,
    categoryGroup: s.user?.categoryGroups?.find((cg: any) => cg.hexathon === currentHexathon?.id)?.name ?? "Unknown",
    currentRoom: tgMap.get(s.currentTableGroupId) ?? "None",
    roomSwitchCount: s.roomSwitchCount,
    bannedRooms: s.bannedTableGroupIds?.length ?? 0,
    completed: s.user?.assignments?.filter((a: any) => a.status === "COMPLETED").length ?? 0,
    skipped: s.user?.assignments?.filter((a: any) => a.status === "SKIPPED").length ?? 0,
    queued: s.user?.assignments?.filter((a: any) => a.status === "QUEUED").length ?? 0,
  }));

  const judgeColumns = [
    { title: "Judge", dataIndex: "judgeName", key: "judgeName", sorter: (a: any, b: any) => a.judgeName.localeCompare(b.judgeName) },
    {
      title: "Category Group", dataIndex: "categoryGroup", key: "categoryGroup",
      filters: Array.from(new Set(judgeStats.map((j: any) => j.categoryGroup))).map(name => ({ text: name, value: name })),
      onFilter: (value: any, record: any) => record.categoryGroup === value,
    },
    { title: "Current Room", dataIndex: "currentRoom", key: "currentRoom" },
    { title: "Room Switches", dataIndex: "roomSwitchCount", key: "roomSwitchCount", sorter: (a: any, b: any) => a.roomSwitchCount - b.roomSwitchCount },
    { title: "Banned Rooms", dataIndex: "bannedRooms", key: "bannedRooms" },
    { title: "Completed", dataIndex: "completed", key: "completed", sorter: (a: any, b: any) => a.completed - b.completed },
    { title: "Skipped", dataIndex: "skipped", key: "skipped" },
    { title: "Queued", dataIndex: "queued", key: "queued" },
  ];

  const legend = (
    <Box display="flex" gap="6px" alignItems="center" mb={2}>
      {JUDGING_LEGEND.map(({ label, bg, color }) => (
        <div
          key={label}
          style={{
            backgroundColor: bg,
            color,
            padding: "2px 8px",
            borderRadius: 4,
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {label}
        </div>
      ))}
    </Box>
  );

  return (
    <>
      <Title level={4}>Projects per Room by Track</Title>
      <Table
        dataSource={heatmapData}
        columns={heatmapColumns}
        pagination={false}
        size="small"
        scroll={{ x: "max-content" }}
        style={{ marginBottom: 32 }}
      />

      <Title level={4}>Judging Progress by Track</Title>
      {legend}
      {categoryGroups.map((cg: any) => {
        const categoryIds = new Set(cg.categories?.map((c: any) => c.id) ?? []);
        const trackProjects = projects
          .filter((p: any) => p.categories?.some((c: any) => categoryIds.has(c.id)))
          .sort((a: any, b: any) => a.table - b.table);
        const projCounts = cgJudgeCounts.get(cg.id) ?? new Map<number, number>();

        return (
          <Box key={cg.id} mb={3}>
            <Box mb={1}>
              <strong>{cg.name}</strong>
              {cg.isSponsor && <Tag color="orange" style={{ marginLeft: 4 }}>S</Tag>}
              <span style={{ marginLeft: 8, color: "#888", fontSize: 12 }}>{trackProjects.length} projects</span>
            </Box>
            <Box display="flex" flexWrap="wrap" gap="4px">
              {trackProjects.map((proj: any) => (
                <ProjectDot
                  key={proj.id}
                  count={projCounts.get(proj.id) ?? 0}
                  name={proj.name}
                  table={proj.table}
                  room={tgMap.get(proj.tableGroupId) ?? "?"}
                />
              ))}
            </Box>
          </Box>
        );
      })}

      <Title level={4} style={{ marginTop: 16 }}>Judging Progress by Room</Title>
      {legend}
      {tableGroups.map((tg: any) => {
        const roomProjects = projects
          .filter((p: any) => p.tableGroupId === tg.id)
          .sort((a: any, b: any) => a.table - b.table);

        return (
          <Box key={tg.id} mb={3}>
            <Box mb={1}>
              <strong>{tg.name}</strong>
              <span style={{ marginLeft: 8, color: "#888", fontSize: 12 }}>{roomProjects.length} projects</span>
            </Box>
            <Box display="flex" flexWrap="wrap" gap="4px">
              {roomProjects.map((proj: any) => (
                <ProjectDot
                  key={proj.id}
                  count={projJudgeCounts.get(proj.id) ?? 0}
                  name={proj.name}
                  table={proj.table}
                  room={tg.name}
                />
              ))}
            </Box>
          </Box>
        );
      })}

      <Title level={4} style={{ marginTop: 16 }}>Judges</Title>
      <Table
        dataSource={judgeStats}
        columns={judgeColumns}
        pagination={{ pageSize: 20 }}
        size="small"
        rowKey="key"
      />
    </>
  );
};

export default JudgingOverviewPane;
