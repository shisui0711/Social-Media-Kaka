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
import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import { Loader2 } from "lucide-react";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  safari: {
    label: "Safari",
    color: "hsl(262.1 83.3% 57.8%)",
  },
} satisfies ChartConfig;

export function TotalMediaChart() {
  const client = useApiClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["total-media"],
    queryFn: () => client.getTotalMedia(),
    refetchOnWindowFocus: false,
  });

  const chartData = [
    { browser: "safari", visitors: data, fill: "hsl(262.1 83.3% 57.8%)" },
  ];
  return (
    <Card className="flex flex-col">
      {isError ? (
        <div className="text-destructive">
          Có lỗi xảy ra. Vui lòng thử lại sau.
        </div>
      ) : (
        <>
          <CardHeader className="items-center pb-0">
            <CardTitle className="mb-3 lg:mb-0">
              Số lượng hình ảnh/video
            </CardTitle>
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
                  endAngle={250}
                  innerRadius={80}
                  outerRadius={110}
                >
                  <PolarGrid
                    gridType="circle"
                    radialLines={false}
                    stroke="none"
                    className="first:fill-muted last:fill-background"
                    polarRadius={[86, 64]}
                  />
                  <RadialBar dataKey="visitors" background cornerRadius={10} />
                  <PolarRadiusAxis
                    tick={false}
                    tickLine={false}
                    axisLine={false}
                  >
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
                                {chartData[0]?.visitors?.toLocaleString()}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground"
                              >
                                ảnh/video
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
        </>
      )}
    </Card>
  );
}
