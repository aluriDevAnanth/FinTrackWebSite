import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReactElement, useEffect, useRef, useState } from "react";

import { Settings2, Settings as SettingsIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

import { createSwapy, Swapy } from "swapy";

function Settings<TData>({ table }: { table: Table<TData> }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <SettingsIcon strokeWidth={2} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-fit">
        <DropdownMenuGroup>
          <DropdownMenuItem
            variant="destructive"
            onClick={(e) => {
              e.preventDefault();
              table.resetColumnPinning();
            }}
            onKeyDown={(e) => {
              e.preventDefault();
            }}
          >
            Reset Pinning
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={(e) => {
              e.preventDefault();
              table.resetColumnOrder();
            }}
            onKeyDown={(e) => {
              e.preventDefault();
            }}
          >
            Reset Column Order
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={(e) => {
              e.preventDefault();
              table.reset();
            }}
            onKeyDown={(e) => {
              e.preventDefault();
            }}
          >
            Reset Table State
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  AddDialog: (props: { table: Table<TData> }) => ReactElement;
}

function ToggleColumn<TData>({ table }: { table: Table<TData> }) {
  const [search, setSearch] = useState("");

  const swapy = useRef<Swapy | null>(null);
  const container = useRef(null);

  const filteredColumns = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== "undefined" && column.getCanHide()
    )
    .filter((column) => column.id.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    if (!container.current) return;

    if (container.current) {
      swapy.current = createSwapy(container.current, {
        autoScrollOnDrag: true,
        dragAxis: "y",
      });
    }

    return () => {
      swapy.current?.destroy();
    };
  }, [filteredColumns.length, table]);

  return (
    <DropdownMenu onOpenChange={() => setSearch("")}>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline">
          <Settings2 />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex gap-3 items-center">
            <Input
              className="size-4"
              {...{
                type: "checkbox",
                checked: table.getIsAllColumnsVisible(),
                onChange: table.getToggleAllColumnsVisibilityHandler(),
              }}
            />
            <div>Toggle columns</div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div
          className="flex relative mx-2"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Input
            type="text"
            value={search}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setSearch(event.currentTarget.value);
            }}
          />
          {search && (
            <div
              onClick={() => setSearch("")}
              className="top-2 right-2 absolute hover:cursor-pointer"
            >
              <X className="size-6" />
            </div>
          )}
        </div>
        <DropdownMenuSeparator />
        <div ref={container}>
          {filteredColumns.length > 0 ? (
            filteredColumns.map((column) => (
              <div key={column.id} data-swapy-slot={column.id}>
                <DropdownMenuCheckboxItem
                  data-swapy-item={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  onSelect={(e) => e.preventDefault()}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              </div>
            ))
          ) : (
            <div className="p-2 text-sm text-muted-foreground">
              No columns found
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function DataTableHeader<TData>({
  table,
  AddDialog,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().globalFilter;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-1">
        <Input
          placeholder="Filter tasks..."
          value={(table.getState().globalFilter as string) ?? ""}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {isFiltered && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => table.resetGlobalFilter()}
            className="h-8 px-2 lg:px-3 "
          >
            <X />
          </Button>
        )}
      </div>

      <div className="flex gap-3">
        <div>
          <ToggleColumn table={table} />
        </div>
        <AddDialog table={table} />
        <Settings table={table} />
      </div>
    </div>
  );
}
