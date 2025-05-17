import { createFileRoute } from "@tanstack/react-router";
import trpc from "src/trpc";
import DataTable from "src/components/DataTable";
import { ColumnDef, Row, Table } from "@tanstack/react-table";
import * as types from "src/schema";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "src/context/AuthCon";
import dayjs from "dayjs";
import DataTableColumnHeader from "src/components/DataTableColumnHeader";
import { Input } from "@/components/ui/input";
import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Plus, Settings2, Trash } from "lucide-react";

export const Route = createFileRoute("/incomes")({
  component: Incomes,
});

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { FloatingLabelInput } from "@/components/ui/floating-label-input";

export function OpMenu<TData extends types.IncomeT>({
  row,
  table,
}: {
  row: Row<TData>;
  table: Table<TData>;
}) {
  const rowData = row.original as TData;

  const [editOpen, setEditOpen] = useState(false);

  interface MyTableMeta<TData> {
    setData: React.Dispatch<React.SetStateAction<TData[]>>;
  }
  const meta = table.options.meta as MyTableMeta<TData>;

  async function handleDelete() {
    const deletedIncome = await trpc.incomes.delete.mutate(rowData.incomeId);
    meta.setData((old) =>
      old.filter((row) => deletedIncome.incomeId !== row.incomeId)
    );
  }

  async function handleEdit(e: FormEvent<HTMLFormElement>) {
    try {
      const editData = await types.IncomeUS.validate({
        ...Object.fromEntries(new FormData(e.currentTarget as HTMLFormElement)),
      });

      const updatedIncome = await trpc.incomes.update.mutate(editData);
      meta.setData((old) =>
        old.map((row) =>
          rowData.incomeId !== row.incomeId
            ? row
            : (updatedIncome as unknown as TData)
        )
      );
      setEditOpen(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="outline">
            <Settings2 />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-32 ml-4">
          <DropdownMenuLabel>Income Ops</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                setTimeout(() => {
                  setEditOpen(true);
                }, 0);
              }}
            >
              Edit
              <DropdownMenuShortcut>
                <Pencil />
              </DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleDelete} variant="destructive">
              Delete
              <DropdownMenuShortcut>
                <Trash />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEdit(e);
            }}
            className="grid gap-4 py-4"
          >
            <Input
              name="incomeId"
              hidden={true}
              defaultValue={rowData.incomeId}
            />
            <Input
              name="amount"
              placeholder="amount"
              type="number"
              defaultValue={rowData.amount}
            />
            <Input
              name="description"
              placeholder="description"
              defaultValue={rowData.description}
            />
            <Input
              type="date"
              name="incomeDate"
              placeholder="Income Date"
              defaultValue={dayjs(rowData.incomeDate).format("YYYY-MM-DD")}
            />
            <Button type="submit">Save</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function AddIncomeDialog<TData>({ table }: { table: Table<TData> }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();

  async function handleAddIncome<
    T extends { amount: number; description: string; incomeDate: string },
  >(newIncomeData: T) {
    try {
      interface MyTableMeta<TData> {
        setData: React.Dispatch<React.SetStateAction<TData[]>>;
      }

      const meta = table.options.meta as MyTableMeta<TData>;

      const data: types.IncomeCT = {
        userId: user?.userId || 0,
        amount: newIncomeData.amount,
        description: newIncomeData.description,
        incomeDate: new Date(newIncomeData.incomeDate),
      };
      const newIncome = await types.IncomeS.validate(
        await trpc.incomes.create.mutate(data)
      );
      meta.setData((prev) => [...prev, newIncome as TData]);
    } catch (error) {
      console.error(error);
    }
  }

  function FieldInfo({ field }: { field: AnyFieldApi }) {
    return (
      <>
        {field.state.meta.isTouched && !field.state.meta.isValid ? (
          <em className="text-sm text-red-600">
            {field.state.meta.errors.map((err) => err.message).join(",")}
          </em>
        ) : null}
      </>
    );
  }

  const newIncomeSchema = z.object({
    amount: z.number().positive(),
    description: z.string(),
    incomeDate: z.string().date(),
  });

  const form = useForm({
    defaultValues: {
      amount: 1,
      description: "",
      incomeDate: "",
    },
    onSubmit: (props) => {
      handleAddIncome<z.infer<typeof newIncomeSchema>>(props.value);
    },
    validators: { onChange: newIncomeSchema },
  });

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus size={48} strokeWidth={3} />
          New
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Income</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
            setDialogOpen(false);
          }}
          className="grid gap-4 py-4"
        >
          <form.Field
            name="amount"
            children={(field) => {
              return (
                <>
                  <FloatingLabelInput
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    label="Amount"
                    type="number"
                    className="border-1 border-white"
                  />
                  <FieldInfo field={field} />
                </>
              );
            }}
          />
          <form.Field
            name="description"
            children={(field) => {
              return (
                <>
                  <FloatingLabelInput
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    label="Description"
                    type="text"
                  />
                  <FieldInfo field={field} />
                </>
              );
            }}
          />
          <form.Field
            name="incomeDate"
            children={(field) => {
              return (
                <>
                  <FloatingLabelInput
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    label="Income Date"
                    type="date"
                    style={{ colorScheme: "dark" }}
                  />
                  <FieldInfo field={field} />
                </>
              );
            }}
          />
          <Button variant="outline" type="submit">
            Add Income
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const columns: ColumnDef<types.IncomeT>[] = [
  {
    accessorKey: "options",
    header: () => (
      <div className="flex justify-end">
        <p>Op</p>
      </div>
    ),
    cell: ({ row, table }) => {
      return (
        <div className="text-right font-medium max-w-2">
          <OpMenu<types.IncomeT> row={row} table={table} />
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <div className="ms-auto">
        <DataTableColumnHeader column={column} title="Amount" />
      </div>
    ),
    enableMultiSort: true,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="text-right font-medium pr-3">{formatted}</div>;
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    enableMultiSort: true,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium pr-3">
          {row.getValue("description")}
        </div>
      );
    },
  },
  {
    accessorKey: "incomeDate",
    accessorFn: (row) => dayjs(row.incomeDate).format("YYYY-MM-DD"),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Income Date" />
    ),
    enableMultiSort: true,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium pr-3">
          {dayjs(row.getValue("incomeDate")).format("YYYY-MM-DD")}
        </div>
      );
    },
  },
];

export default function Incomes() {
  const [data, setData] = useState<types.IncomeT[]>([]);
  const { auth } = useAuth();

  useEffect(() => {
    if (!auth) return;
    (async function () {
      const rawData = await trpc.incomes.getByUserId.query(1);
      const validatedData = await Promise.all(
        rawData.map((income) => types.IncomeS.validate(income))
      );
      setData(validatedData);
    })();
  }, [auth]);

  return (
    <div className="max-w-[100vw] px-5">
      <DataTable<types.IncomeT, unknown>
        tableName="Income"
        AddDialog={AddIncomeDialog}
        columns={columns}
        data={data}
        setData={setData}
        paginationArr={[10, 20, 50, 100]}
      />
    </div>
  );
}
