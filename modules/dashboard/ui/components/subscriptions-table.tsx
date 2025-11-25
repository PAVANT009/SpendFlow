// "use client";

// import { Subscription } from '@/types/Subscription';
// import React, { useEffect, useState } from 'react'

// export  default  function SubscriptionTable() {
//     const[data,setData] = useState<Subscription[]>([]);

//     useEffect(() => {
//         const  fetchData = async() => {

//             const res = await fetch('/api/subscriptions');
//             const data = await res.json();
//             setData(data);
//             console.log(data);
//         }
//         fetchData();
//     },[])
//   return (
//     <div>
//       {data.map((sub) => (
//         <div key={sub.logo_url}>
//             {sub.domain}
//             {sub.name}
//             {sub.amount}
//         </div>
//       ))}
//     </div>
//   )
// }
"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Subscription } from "@/types/Subscription"
import { cn } from "@/lib/utils"
import { formatToDDMMYYYY, getDateStatus } from "@/util/useDateDifference"
  // Entertainment: "border-blue-500 text-blue-600",
  // Productivity: "border-purple-500 text-purple-600",
  // "Health & Fitness": "border-pink-500 text-pink-600",
  // Development: "border-orange-500 text-orange-600",
  // Cloud: "border-yellow-500 text-yellow-600",
  // Learning: "border-green-500 text-green-600",
const categoryColors: Record<string,string> = {
  Learning: "bg-green-500/30 text-green-300 border-green-700",
  Entertainment: "bg-blue-500/30 text-blue-300 border-blue-700",
  "Health & Fitness": "bg-pink-500/30 text-pink-300 border-pink-700",
  Development: "bg-orange-500/30 text-orange-300 border-green-700",
  Cloud: "bg-yellow-500/30 text-yellow-300 border-yellow-700",
  Productivity: "bg-purple-500/30 text-purple-300 border-purple-700",
};

const dateColors: Record<string, string> = {
  overdue: "bg-red-500",
  thisweek: "bg-pink-500",
  today: "bg-orange-500",
  scheduled: "bg-green-500/20 text-green-600",
}


export const columns: ColumnDef<Subscription>[] = [
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
  // {
  //   accessorKey: "status",
  //   header: "Status",
  //   cell: ({ row }) => (
  //     <div className="capitalize">{row.getValue("status")}</div>
  //   ),
  // },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "category",
    header: () => <div className="text-center">Category</div>,
    cell: ({ row }) => {
      const cat = row.getValue("category") as string;
      const color = categoryColors[cat] ?? "bg-red";

      return (
        <div className="w-full flex justify-center">
          <div
            className={cn(
              "capitalize text-sm border-2 rounded-2xl p-2 w-fit",
              color
            )}
          >
            {row.getValue("category")}
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: "nextBilling",
    header: () => <div className="text-center">Next Billing</div>,
    cell: ({ row }) => {
      const dueStatus = row.getValue("nextBilling") as string;
      const color = dateColors[getDateStatus(dueStatus)] ?? "bg-muted";

      return (
        <div className="flex flex-col gap-2 items-center justify-center text-center w-full">
          <div>{formatToDDMMYYYY(row.getValue("nextBilling"))}</div>
          <div
            className={cn(
              "capitalize text-[12px] w-fit px-2 py-1 rounded-2xl",
              color
            )}
          >
            {getDateStatus(dueStatus)}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function SubscriptionTable() {
    const[data,setData] = React.useState<Subscription[]>([]);

      React.useEffect(() => {
        const  fetchData = async() => {

            const res = await fetch('/api/subscriptions');
            const data = await res.json();
            setData(data);
            console.log(data);
        }
        fetchData();
    },[])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full bg-card/30 border border-border rounded-2xl px-3">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
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
                  )
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

