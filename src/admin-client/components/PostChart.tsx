"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { KeyValuePairOfDateTimeAndInteger } from "@/app/web-api-client";
import { stringToDate } from "@/lib/utils";
import { getStringBeforeByFilter, getStringByFilter } from "@/lib/datetime";

const chartConfig = {
  post: {
    label: "Số bài viết",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function PostChart({
  data,
  handler,
  percent,
  filter,
}: {
  data: KeyValuePairOfDateTimeAndInteger[];
  handler: (value: Date) => string;
  percent: number | undefined;
  filter: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Số lượng bài viết</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={data}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="key"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => handler(stringToDate(value))}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="value"
                type="natural"
                fill="hsl(24.6 95% 53.1%)"
                fillOpacity={0.4}
                stroke="hsl(24.6 95% 53.1%)"
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="size-full flex items-center justify-center text-destructive font-bold">
            Không có dữ liệu nào.
          </div>
        )}
      </CardContent>
      <CardFooter>
        {data.length > 0 && (
          <>
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2">
                {percent !== undefined && (
                  <div className="flex items-center gap-2 font-medium leading-none">
                    {percent < 0 ? "Giảm" : "Tăng"} {percent}% so với{" "}
                    {getStringBeforeByFilter(filter)}{" "}
                    {percent < 0 ? (
                      <TrendingDown className="h-4 w-4" />
                    ) : (
                      <TrendingUp className="h-4 w-4" />
                    )}
                  </div>
                )}
                <div className="leading-none text-muted-foreground">
                  Số lượng bài viết trong {getStringByFilter(filter)}
                </div>
              </div>
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
