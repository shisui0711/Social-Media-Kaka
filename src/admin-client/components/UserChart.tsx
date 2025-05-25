"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

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
  user: {
    label: "Số lượng đăng ký",
    color: "hsl(221.2 83.2% 53.3%)",
  },
} satisfies ChartConfig;

export function UsersChart({
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
        <CardTitle>Số lượng người đăng ký</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={data}
              margin={{
                top: 20,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="key"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => handler(stringToDate(value))}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="value" fill="hsl(221.2 83.2% 53.3%)" radius={8}>
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="size-full flex items-center justify-center text-destructive font-bold">
            Không có dữ liệu nào.
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {data.length > 0 && (
          <>
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
              Số lượng người đăng ký trong {getStringByFilter(filter)}
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
