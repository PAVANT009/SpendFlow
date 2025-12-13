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
import { ArrowUpDown, ChevronDown, CirclePause, MoreHorizontal, RotateCcw, SquarePen, Trash } from "lucide-react"

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
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import MyForm from "./my-form"
import { EditForm } from "./edit-form"
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
  Development: "bg-orange-500/30 text-orange-300 border-orange-700",
  Cloud: "bg-yellow-500/30 text-yellow-300 border-yellow-700",
  Productivity: "bg-purple-500/30 text-purple-300 border-purple-700",
};

const dateColors: Record<string, string> = {
  overdue: "bg-red-500/20 text-red-600",
  thisweek: "bg-pink-500/20 text-pink-600",
  today: "bg-orange-500/20 text-orange-600",
  scheduled: "bg-green-500/20 text-green-600",
}



const SetState = async (id: string, setState: boolean) => {
  return fetch("/api/subscriptions/update", {
    method: "POST",
    body: JSON.stringify({
      id,
      state: setState,
    }),
  });
};


export const getColumns = (
  fetchSubscriptions: () => void,
  setSelectedRow: (row: Subscription | undefined) => void,
  setOpenEdit: (open: boolean) => void
): ColumnDef<Subscription>[] =>  [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        onClick={() => {
              const selectedNames = table
                .getSelectedRowModel()
                .flatRows
                .map((row) => row.original.name)

              console.log(selectedNames)
            }}
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
          type="button"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="flex flex-row gap-2">
        <Image
          width={1}
          height={1}
          src={row.original.logoUrl ?? "/next.svg"} 
          alt="logo"
          className="w-8 h-8 rounded"
        />
        <div className="capitalize text-[20px] font-bold">{row.getValue("name")}</div>
      </div>
    ),
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
              "capitalize text-sm border-2 rounded-2xl px-2 w-fit",
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
    accessorKey: "state",
    header: () => <div className="text-right">Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("state") ? "active" : "paused";
      return <div className={cn("text-right font-medium capitalize", status === "active" ? "text-green-500" : "text-red-500")} >{status}</div>
    }
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    enableHiding: false,
    cell: ({ row,  }) => {


      return (
        <div className="flex flex-row w-16  justify-between relative pl-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0  relative flex  justify-between">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal 
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator/>
            {!(row.original.state) ? (
            <DropdownMenuItem className="text-[#22c55e]" onClick={async () => {
                                await SetState(row.original.id, true);
                                fetchSubscriptions() }}><RotateCcw color="#22c55e"/> Renew</DropdownMenuItem>
            ):(
            <DropdownMenuItem className="text-[#f59e0b]" onClick={async () => {
                                await SetState(row.original.id, false);
                                fetchSubscriptions() }}><CirclePause color="#f59e0b" /> Hold</DropdownMenuItem>
            )}
            <DropdownMenuItem className="text-[#dc2626]"><Trash color="#dc2626"/> Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
              type="button"
              variant="ghost"
              className="h-8 w-8 p-0  relative flex  justify-between"
              onClick={() => {
                        setSelectedRow(row.original)
                        setOpenEdit(true)
                      }}
        >
              <SquarePen
                     
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              />
        </Button>
        </div>
      )
    },
  },
]

interface SubscriptionTableProps {
  data: Subscription[];
  loading: boolean;
  fetchSubscriptions: () => void;
}

export default function SubscriptionTable({ data, loading, fetchSubscriptions }: SubscriptionTableProps) {
    // const[data,setData] = React.useState<Subscription[]>([]);
    // const [loading,setLoading] = React.useState(false);
    //   React.useEffect(() => {
    //     const  fetchData = async() => {
    //        setLoading(true)
    //         const res = await fetch('/api/subscriptions');
    //         const data = await res.json();
            
    //         setData(data);
    //         console.log(data);
    //         setLoading(false)
    //     }
    //     fetchData();
    // },[])
  const [openEdit, setOpenEdit] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<Subscription | undefined>();  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns: getColumns(
      fetchSubscriptions,setSelectedRow,setOpenEdit),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState:{
      pagination: {
      pageSize: 6,
    },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },

  })



  return (
    <div className="w-full bg-card/30 border border-border rounded-2xl px-3">
      <EditForm
        open={openEdit}
        onOpenChange={setOpenEdit}
        data={selectedRow }
        onSubmit={async (values) => {
        await fetch("/api/subscriptions/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    await fetchSubscriptions();
    setOpenEdit(false);
  }}
      />
      <div className="flex items-center w-full py-4">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        {table.getSelectedRowModel().rows.length > 0 && (
          <div className="ml-auto flex gap-4">
          <Button className="text-[#22c55e]  border border-border  rounded-md bg-transparent hover:bg-background"
            onClick={async () => {

              const selectedRows = table.getSelectedRowModel().rows;

              for (const row of selectedRows) {
                await SetState(row.original.id, true);
              }

              await fetchSubscriptions();

              setRowSelection({});
            }}
          ><RotateCcw color="#22c55e"/> Renew
          </Button>
          <Button className="text-[#f59e0b]  border border-border   rounded-md bg-transparent"
            onClick={async () => {

              const selectedRows = table.getSelectedRowModel().rows;

              for (const row of selectedRows) {
                await SetState(row.original.id, false);
              }

              await fetchSubscriptions();

              setRowSelection({});
            }}
          ><CirclePause color="#f59e0b" /> Hold
          </Button>
          </div>
        )}

        <DropdownMenu >
          <DropdownMenuTrigger asChild >
            <Button variant="outline" className="ml-auto ">
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
      <div className="overflow-hidden ">
        <Table >
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
            {
            loading ? 
            [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-5 text-black" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <Skeleton className="bg-accent h-4 w-[100px]" />
                    </div>
                    </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <Skeleton className="h-4 w-[80px]" />
                    </div>
                    </TableCell>
                  <TableCell >
                    <div className="flex justify-end">
                      <Skeleton className="h-4 w-[40px] text-right" />
                    </div>
                    </TableCell>
                </TableRow>
              ))
            : 
            /////////////////// table.getRowModel().rows?.length ? 
            (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group"
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
            ) 
            // : (
            //   <TableRow>
            //     <TableCell
            //       colSpan={columns.length}
            //       className="h-24 text-center"
            //     >
            //       No results.
            //     </TableCell>
            //   </TableRow>
            // )
          }
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

