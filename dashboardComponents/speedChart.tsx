import { Box } from "@primer/react";
import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GTFS, OccupancyData } from "../utils/transit";

interface Props {
  data: GTFS | undefined;
}

const SpeedChart: NextPage<Props> = ({ data }) => {
  const [chartData, setChartData] = useState<OccupancyData[]>();
  const chartRef = useRef<HTMLDivElement>(null);

  const colors = {
    max: "#fe6d73",
    avg: "#17c3b2",
  };

  useEffect(() => {
    if (data) {
      const timestamp = parseInt(data.header.timestamp) * 1000;
      const time = new Date(timestamp).toLocaleTimeString();
      const speeds = data.entity
        .map((entity) => entity.vehicle.position.speed)
        .filter((speed) => speed > 0)
        .map((speed) => speed * 3.6)
        .sort((a, b) => a - b);
      const inTransit = speeds.length;
      const sum = speeds.reduce((a, b) => a + b);
      const avg = sum / inTransit;
      const max = speeds[speeds.length - 1];
      const newData = {
        name: time,
        avg: avg,
        max: max,
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
        behavior: "smooth",
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
          <Box bg="whitesmoke" p={1} borderRadius={4}>
            <Box>{values["name"]}</Box>
            <Box display="flex" justifyContent="space-between">
              <Box color={colors.max}>Full:</Box>
              <Box>{values["max"]}</Box>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box color={colors.avg}>Standing Room:</Box>
              <Box>{values["avg"]}</Box>
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
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip
            content={StackedTooltip}
            allowEscapeViewBox={{ x: false, y: false }}
          />
          <XAxis dataKey="name" />
          <YAxis orientation="right" />
          <Line type="monotone" dataKey="max" stroke={colors.max} />
          <Line type="monotone" dataKey="avg" stroke={colors.avg} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default SpeedChart;
