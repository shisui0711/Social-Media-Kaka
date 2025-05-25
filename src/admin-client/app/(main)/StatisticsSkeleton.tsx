import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

const StatisticsSkeleton = () => {
  return (
    <main className="flex min-w-0 gap-5 flex-1 mt-3 flex-col">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full">
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-4 w-full" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-4 w-full" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-4 w-full" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-4 w-full" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      </div>
      <div className="bg-card rounded-lg p-2 flex flex-col lg:flex-row gap-2 justify-end">
        <Tabs defaultValue="this_day" className="">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="this_day">Hôm nay</TabsTrigger>
            <TabsTrigger value="this_week">Tuần này</TabsTrigger>
            <TabsTrigger value="this_month">Tháng này</TabsTrigger>
            <TabsTrigger value="this_year">Năm nay</TabsTrigger>
            <TabsTrigger value="custom">Tùy chọn</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-card rounded-xl p-10 h-[445px]">
          <Skeleton className="size-full rounded-xl " />
        </div>
        <div className="bg-card rounded-xl p-10 h-[445px]">
          <Skeleton className="size-full rounded-xl " />
        </div>
      </div>
    </main>
  );
};

export default StatisticsSkeleton;
