import { Skeleton, TableCell, TableRow } from "@mui/material";
import { FC } from "react";

const TableCellSkeleton = () => {
  return (
    <TableCell>
      <Skeleton variant="text" height={30} />
    </TableCell>
  );
};

interface TableSkeletonProps {
  row: number;
  column: number;
}

const TableSkeleton: FC<TableSkeletonProps> = ({ row, column }) => {
  return Array.from({ length: row }).map((_, index) => (
    <TableRow key={index}>
      {Array.from({ length: column }).map((_, index) => (
        <TableCellSkeleton key={index} />
      ))}
    </TableRow>
  ));
};

export default TableSkeleton;
