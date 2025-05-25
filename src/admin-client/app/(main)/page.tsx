"use client";

import { UsersChart } from "@/components/UserChart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePicker } from "@/components/ui/DatePicker";
import { useState } from "react";
import { PostChart } from "@/components/PostChart";
import { Button } from "@/components/ui/button";
import { useApiClient } from "../../hooks/useApiClient";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import StatisticsSkeleton from "./StatisticsSkeleton";
import {
  getDateRangeBefore,
  getDifferenceDays,
  getFirstDayOfMonth,
  getFirstDayOfYear,
  getStartOfWeek,
  getToday,
  getWeekOfYear,
} from "@/lib/datetime";
import { UserOnlineChart } from "@/components/UserOnlineChart";
import { TotalPostChart } from "@/components/TotalPostChart";
import { TotalUserChart } from "@/components/TotalUserChart";
import { TotalMediaChart } from "@/components/TotalMediaChart";

export default function Home() {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [dateFilter, setDateFilter] = useState("this_day");
  const queryClient = useQueryClient();
  const client = useApiClient();

  const dateStringHandler = (value: Date): string => {
    if (!startDate || !endDate) return "";
    const days = getDifferenceDays(startDate, endDate);
    if (days <= 1)
      return new Intl.DateTimeFormat("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true, // Định dạng 12 giờ với AM/PM
      }).format(value);
    else if (days <= 30)
      return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "short", // Sử dụng tên tháng viết tắt
      }).format(value);
    else if (days <= 92) return `Tuần ${getWeekOfYear(value)}`;
    else if (days <= 365 * 2) {
      const isYear = days <= 365;
      const output = new Intl.DateTimeFormat("vi-VN", {
        month: "short", // Tên tháng viết tắt (ví dụ: Jan, Feb, Mar,...)
        year: "numeric", // Năm đầy đủ (ví dụ: 2024)
      }).format(value);
      if (isYear) output.substring(0, output.indexOf(" "));
      return output;
    } else return value.getFullYear().toString();
  };

  const dataPointResults = useQueries({
    queries: [
      {
        queryKey: ["user-datapoints"],
        queryFn: () =>
          client.getUserDataPoints(
            startDate?.toDateString() ?? new Date().toDateString(),
            endDate?.toDateString() ?? new Date().toDateString()
          ),
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ["post-datapoints"],
        queryFn: () =>
          client.getPostDataPoints(
            startDate?.toDateString() ?? new Date().toDateString(),
            endDate?.toDateString() ?? new Date().toDateString()
          ),
        refetchOnWindowFocus: false,
      },
    ],
  });

  const trendPercentResults = useQueries({
    queries: [
      {
        queryKey: ["post-trend"],
        queryFn: () => {
          const {
            firstStartDate,
            firstEndDate,
            secondEndDate,
            secondStartDate,
          } = getDateRangeBefore(
            startDate ?? new Date(),
            endDate ?? new Date()
          );
          return client.getPostPercentTrend(
            firstStartDate,
            firstEndDate,
            secondStartDate,
            secondEndDate
          );
        },
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ["user-trend"],
        queryFn: () => {
          const {
            firstStartDate,
            firstEndDate,
            secondEndDate,
            secondStartDate,
          } = getDateRangeBefore(
            startDate ?? new Date(),
            endDate ?? new Date()
          );
          return client.getUserPercentTrend(
            firstStartDate,
            firstEndDate,
            secondStartDate,
            secondEndDate
          );
        },
        refetchOnWindowFocus: false,
      },
    ],
  });

  const refetchData = () => {
    queryClient.invalidateQueries({
      queryKey: ["user-datapoints"],
    });
    queryClient.invalidateQueries({
      queryKey: ["post-datapoints"],
    });
    queryClient.invalidateQueries({
      queryKey: ["post-trend"],
    });
    queryClient.invalidateQueries({
      queryKey: ["user-trend"],
    });
  }

  const isLoading =
    dataPointResults.some((x) => x.isLoading) ||
    trendPercentResults.some((x) => x.isLoading);

  const isError =
    dataPointResults.some((x) => x.isError) ||
    trendPercentResults.some((x) => x.isError);
  if (isLoading) return <StatisticsSkeleton />;
  if (isError) return <></>;

  return (
    <main className="flex min-w-0 gap-5 flex-1 mt-3 flex-col">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full">
        <TotalUserChart/>
        <TotalPostChart/>
        <TotalMediaChart/>
        <UserOnlineChart/>
      </div>
      <div className="bg-card rounded-lg p-2 flex flex-col lg:flex-row gap-2 justify-end">
        {dateFilter === "custom" && (
          <div className="flex flex-col lg:flex-row gap-2 items-start">
            <Button
              className="w-fit"
              onClick={refetchData}
            >
              Xác nhận
            </Button>
            <DatePicker date={startDate} setDate={setStartDate} />
            <DatePicker date={endDate} setDate={setEndDate} />
          </div>
        )}
        <Tabs defaultValue="this_day" className="">
          <TabsList className="grid h-fit w-full grid-cols-3 gap-2 lg:grid-cols-5">
            <TabsTrigger
              value="this_day"
              onClick={() => {
                setDateFilter("this_day");
                setStartDate(getToday());
                setEndDate(new Date());
                refetchData()
              }}
            >
              Hôm nay
            </TabsTrigger>
            <TabsTrigger
              value="this_week"
              onClick={() => {
                setDateFilter("this_week");
                setStartDate(getStartOfWeek());
                setEndDate(new Date());
                refetchData()
              }}
            >
              Tuần này
            </TabsTrigger>
            <TabsTrigger
              value="this_month"
              onClick={() => {
                setDateFilter("this_month");
                setStartDate(getFirstDayOfMonth());
                setEndDate(new Date());
                refetchData()
              }}
            >
              Tháng này
            </TabsTrigger>
            <TabsTrigger
              value="this_year"
              onClick={() => {
                setDateFilter("this_year");
                setStartDate(getFirstDayOfYear());
                setEndDate(new Date());
                refetchData()
              }}
            >
              Năm nay
            </TabsTrigger>
            <TabsTrigger value="custom" onClick={() => setDateFilter("custom")}>
              Tùy chọn
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3">
        <UsersChart
          filter={dateFilter}
          percent={trendPercentResults[0].data}
          handler={dateStringHandler}
          data={dataPointResults[0].data!}
        />
        <PostChart
          filter={dateFilter}
          percent={trendPercentResults[1].data}
          handler={dateStringHandler}
          data={dataPointResults[1].data!}
        />
      </div>
    </main>
  );
}
