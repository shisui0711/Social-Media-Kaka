import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const FriendComponentSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 20 }, (_, index) => index).map((_,index) => (
        <Card key={index}>
          <CardHeader className="flex-center">
            <Skeleton className="h-24 w-24 rounded-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-full h-8" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default FriendComponentSkeleton;
