"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import { PaginatedListOfUserDto, UserDto } from "@/app/web-api-client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Checkbox } from "@/components/ui/checkbox";
import { useDeleteUserMutation } from "./mutations";


export default function UsersPage() {
  const mutation = useDeleteUserMutation();
  const columns: ColumnDef<UserDto>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "userName",
      header: "UserName",
      cell: ({ row }) => (
        <div className="line-clamp-1">{row.getValue("userName")}</div>
      ),
    },
    {
      accessorKey: "displayName",
      header: "Tên hiển thị",
      cell: ({ row }) => (
        <div className="line-clamp-1">{row.getValue("displayName")}</div>
      ),
    },
    {
      accessorFn: (row) => row.followers.length + "",
      header: "Số người theo dõi",
      cell: (info) => (
        <div className="line-clamp-1">{info.getValue() as string}</div>
      ),
    },
    {
      accessorFn: (row) => row.followings.length + "",
      header: "Đang theo dõi",
      cell: (info) => (
        <div className="line-clamp-1">{info.getValue() as string}</div>
      ),
    },
    {
      accessorFn: (row) => row.posts.length + "",
      header: "Tổng số bài viết",
      cell: (info) => (
        <div className="line-clamp-1">{info.getValue() as string}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Sao chép</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onClick={() =>
                        navigator.clipboard.writeText(item.userName)
                      }
                    >
                      UserName
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        navigator.clipboard.writeText(item.displayName)
                      }
                    >
                      Tên hiển thị
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem onClick={() => mutation.mutate(item.id)}>
                Xóa người dùng
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const client = useApiClient();
  const [rowSelection, setRowSelection] = React.useState({});

  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
  } = useInfiniteQuery({
    queryKey: ["users-admin"],
    queryFn: async ({ pageParam }): Promise<PaginatedListOfUserDto> =>
      client.getUsersWithPagination(pageParam, 10),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.pageNumber + 1 : undefined;
    },
    getPreviousPageParam: (firstPage) =>
      firstPage.hasPreviousPage ? firstPage.pageNumber - 1 : undefined,
    refetchOnWindowFocus: false,
  });

  const items = data?.pages[data.pages.length - 1]?.items || [];
  const [currentPage, setCurrentPage] = useState(1);

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  const handleNextPage = async () => {
    if (hasNextPage) {
      await fetchNextPage();
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = async () => {
    if (currentPage > 1) {
      await fetchPreviousPage();
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="container mx-auto bg-card p-3 mt-3 rounded-xl h-screen">
      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
            placeholder="Tìm kiếm người dùng..."
            value={
              (table.getColumn("displayName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              table.getColumn("displayName")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Không tìm thấy kết quả nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} trên{" "}
          {table.getFilteredRowModel().rows.length} dòng đã chọn.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={!hasPreviousPage || isFetchingPreviousPage}
          >
            Trang trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={!hasNextPage || isFetchingNextPage}
          >
            Trang sau
          </Button>
        </div>
      </div>
    </div>
  );
}
