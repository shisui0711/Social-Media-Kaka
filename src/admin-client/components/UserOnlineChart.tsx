"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import { Loader2 } from "lucide-react";
import { useSignalR } from "@/providers/SignalRProvider";
import { useEffect } from "react";

const chartConfig = {
  userOnline: {
    label: "UserOnline",
  },
  online: {
    label: "Online",
    color: "hsl(142.1 76.2% 36.3%)",
  },
} satisfies ChartConfig;

export function UserOnlineChart() {
  const client = useApiClient();
  const { connection } = useSignalR();
  const queryClient = useQueryClient();
  const results = useQueries({
    queries: [
      {
        queryKey: ["total-user"],
        queryFn: () => client.getTotalUser(),
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ["total-online"],
        queryFn: () => client.getTotalUserOnline(),
        refetchOnWindowFocus: false,
      },
    ],
  });

  const totalUser = results[0].data ?? 1;
  const totalOnline = results[1].data ?? 0;

  useEffect(()=>{
    if(connection){
      const handle = () => {
        queryClient.invalidateQueries({
          queryKey: ["total-online"],
        });
      }
      connection.on("UserStatusChanged",handle)
      return () => connection.off("UserStatusChanged",handle)
    }
  },[connection, queryClient])
  const endAngle = Math.trunc((totalOnline / totalUser) * 360);
  const isLoading = results.some((x) => x.isLoading);
  const chartData = [
    { userOnline: "UserOnline", online: totalOnline, fill: "hsl(142.1 76.2% 36.3%)" },
  ];

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="mb-3 lg:mb-0">Số người dùng đang hoạt động</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-3 lg:pb-0">
        {isLoading ? (
          <Loader2 className="animate-spin mx-auto" />
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <RadialBarChart
              data={chartData}
              startAngle={0}
              endAngle={endAngle}
              innerRadius={80}
              outerRadius={110}
            >
              <PolarGrid
                gridType="circle"
                radialLines={false}
                stroke="none"
                className="first:fill-muted last:fill-background"
                polarRadius={[86, 74]}
              />
              <RadialBar dataKey="online" background cornerRadius={10} />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-4xl font-bold"
                          >
                            {chartData[0].online}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Đang hoạt động
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
