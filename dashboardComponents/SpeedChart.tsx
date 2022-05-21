import { Box } from "@primer/react";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getHistogram, GTFS } from "../utils/transit";

interface Props {
  data: GTFS | undefined;
}

const SpeedChart: NextPage<Props> = ({ data }) => {
  const [chartData, setChartData] = useState<any>();

  useEffect(() => {
    if (data) {
      const speeds = data.entity
        .filter((entity) => entity.vehicle.currentStatus === "IN_TRANSIT_TO")
        .map((entity) => entity.vehicle.position.speed);
      const histogram = getHistogram(speeds);
      setChartData(histogram);
    }
  }, [data]);

  const CustomTooltip = (d: any) => {
    const chart = d.payload[0];
    const key = chart && chart.dataKey;
    const value = chart && chart.payload[key];
    const bin = chart && chart.payload.name;
    return (
      <Box fontSize={14}>
        {chart && (
          <Box bg="canvas.default" p={1} borderRadius={4}>
            <Box>
              {bin === 0
                ? `${value} vehicles stopped in traffic`
                : `${value} vehicles at ${bin} km/h`}
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box width="100%" height="100%">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barCategoryGap={0}>
          <CartesianGrid horizontal vertical={false} strokeDasharray="3" />
          <XAxis dataKey="name" domain={[0, 100]} />
          <YAxis orientation="right" />
          <Tooltip content={CustomTooltip} />
          <Bar dataKey="count" fill="#fe6d73" opacity={0.65} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default SpeedChart;
