import { Box } from "@primer/react";
import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { getCount, GTFS, Status, StatusData } from "../utils/transit";

interface Props {
  data: GTFS | undefined;
}

const VehicleChart: NextPage<Props> = ({ data }) => {
  const [chartData, setChartData] = useState<StatusData[]>();
  const chartRef = useRef<HTMLDivElement>(null);

  const colors = {
    stopped: "#fe6d73",
    stoppedAt: "#ffcb77",
    inTransit: "#17c3b2",
  };

  useEffect(() => {
    if (data) {
      const timestamp = parseInt(data.header.timestamp) * 1000;
      const time = new Date(timestamp).toLocaleTimeString();
      const stopped = data.entity
        .filter((entity) => entity.vehicle.position.speed === 0)
        .filter(
          (entity) => entity.vehicle.currentStatus !== "STOPPED_AT"
        ).length;
      const status = data.entity.map((entity) => entity.vehicle.currentStatus);
      const newData = {
        name: time,
        STOPPED: stopped,
        ...getCount<Status>(status),
      };
      if (chartData) {
        setChartData((prev: any) => [...prev, newData]);
      } else {
        setChartData([newData]);
      }
    }
  }, [data]);

  const scrollToEnd = () => {
    chartRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "end",
    });
  };

  useEffect(() => {
    if (chartRef.current) {
      scrollToEnd();
    }
  }, [chartData, scrollToEnd]);

  const StackedTooltip = (d: any) => {
    const chart = d.payload[0];
    const values = chart && d.payload[0].payload;
    return (
      <Box>
        {chart && (
          <Box bg="whitesmoke" p={2} borderRadius={4}>
            <Box m={1}>{values["name"]}</Box>
            <Box display="flex" justifyContent="space-between">
              <Box m={1} color={colors.stopped}>
                Stopped in Traffic:
              </Box>
              <Box m={1}>{values["STOPPED"]}</Box>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box m={1} color={colors.stoppedAt}>
                At Stop:
              </Box>
              <Box m={1}>{values["STOPPED_AT"]}</Box>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box m={1} color={colors.inTransit}>
                In Transit:
              </Box>
              <Box m={1}>{values["IN_TRANSIT_TO"]}</Box>
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
            allowEscapeViewBox={{ x: true, y: true }}
          />
          <Area
            type="monotone"
            dataKey="IN_TRANSIT_TO"
            stackId="1"
            stroke={colors.inTransit}
            fill={colors.inTransit}
          />
          <Area
            type="monotone"
            dataKey="STOPPED_AT"
            stackId="1"
            stroke={colors.stoppedAt}
            fill={colors.stoppedAt}
          />
          <Area
            type="monotone"
            dataKey="STOPPED"
            stackId="1"
            stroke={colors.stopped}
            fill={colors.stopped}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default VehicleChart;
