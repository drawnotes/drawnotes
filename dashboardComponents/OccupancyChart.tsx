import { Box } from "@primer/react";
import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getCount, GTFS, Occupancy, OccupancyData } from "../utils/transit";

interface Props {
  data: GTFS | undefined;
}

const OccupancyChart: NextPage<Props> = ({ data }) => {
  const [chartData, setChartData] = useState<OccupancyData[]>();
  const chartRef = useRef<HTMLDivElement>(null);

  const colors = {
    full: "#fe6d73",
    standing: "#ffcb77",
    few: "#17c3b2",
    many: "#227c9d",
  };

  useEffect(() => {
    if (data) {
      const timestamp = parseInt(data.header.timestamp) * 1000;
      const time = new Date(timestamp).toLocaleTimeString();
      const occupancy = data.entity.map(
        (entity) => entity.vehicle.occupancyStatus
      );
      const newData = {
        name: time,
        ...getCount<Occupancy>(occupancy),
      };
      if (chartData) {
        setChartData((prev: any) => [...prev, newData]);
      } else {
        setChartData([newData, newData]);
      }
    }
  }, [data]);

  useEffect(() => {
    const scrollToEnd = () => {
      chartRef.current?.scrollIntoView({
        inline: "end",
      });
    };
    if (chartRef.current) {
      scrollToEnd();
    }
  }, [chartData]);

  const StackedTooltip = (d: any) => {
    const chart = d.payload[0];
    const values = chart && d.payload[0].payload;
    return (
      <Box fontSize={14}>
        {chart && (
          <Box bg="canvas.default" p={1} borderRadius={4}>
            <Box>{values["name"]}</Box>
            <Box display="flex" justifyContent="space-between">
              <Box color={colors.full}>Full:</Box>
              <Box>{values["FULL"]}</Box>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box color={colors.standing}>Standing Room:</Box>
              <Box>{values["STANDING_ROOM_ONLY"]}</Box>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box color={colors.few}>Few Seats:</Box>
              <Box>{values["FEW_SEATS_AVAILABLE"]}</Box>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box color={colors.many}>Many Seats:</Box>
              <Box>{values["MANY_SEATS_AVAILABLE"]}</Box>
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box
      width={chartData && `${chartData.length * 100}px`}
      minWidth="100%"
      height="100%"
      ref={chartRef}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip
            content={StackedTooltip}
            allowEscapeViewBox={{ x: false, y: false }}
          />
          <XAxis dataKey="name" />
          <YAxis
            orientation="right"
            tickFormatter={(d) => (d === 0 ? "" : d)}
          />
          <Area
            type="monotone"
            dataKey="MANY_SEATS_AVAILABLE"
            stackId="1"
            stroke={colors.many}
            fill={colors.many}
          />
          <Area
            type="monotone"
            dataKey="FEW_SEATS_AVAILABLE"
            stackId="1"
            stroke={colors.few}
            fill={colors.few}
          />
          <Area
            type="monotone"
            dataKey="STANDING_ROOM_ONLY"
            stackId="1"
            stroke={colors.standing}
            fill={colors.standing}
          />
          <Area
            type="monotone"
            dataKey="FULL"
            stackId="1"
            stroke={colors.full}
            fill={colors.full}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default OccupancyChart;
