import { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HTMLAttributes } from "react";

interface DataTableColumnHeaderProps<TData, TValue>
  extends HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export default function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const handleToggleSort = () => {
    const current = column.getIsSorted();
    if (current === false) {
      column.toggleSorting(false);
    } else if (current === "asc") {
      column.toggleSorting(true);
    } else {
      column.clearSorting();
    }
  };

  const renderSortIcon = () => {
    const current = column.getIsSorted();
    if (current === "asc") return <ArrowUp className="ml-1 w-4 h-4" />;
    if (current === "desc") return <ArrowDown className="ml-1 w-4 h-4" />;
    return <Minus className="ml-1 w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div className={cn("flex items-center justify-end", className)}>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 px-2"
        onClick={handleToggleSort}
      >
        <span>{title}</span>
        {renderSortIcon()}
      </Button>
    </div>
  );
}
