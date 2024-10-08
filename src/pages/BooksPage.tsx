import { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { LoadingButton } from "@mui/lab";

import Empty from "../components/Empty";
import TableSkeleton from "../components/TableSkeleton";

import request from "../server/request";

import useDeleteConfirmDialog from "./../hooks/useDeleteConfirmDialog";
import useBookFormDialog from "../hooks/useBookFormDialog";
import useBooksTable from "../hooks/useBooksTable";

const BooksPage = () => {
  const { books, loading, getBooks, changeStatus } = useBooksTable();

  const { DeleteConfirmDialog, openDeleteConfirmDialog } =
    useDeleteConfirmDialog(deleteBook);

  const { BookFormDialog, openBookFormDialog } = useBookFormDialog({
    getBooks,
  });

  const [deletedId, setDeletetedId] = useState<number | null>(null);

  const openDeleteConfirmDialogBtn = (id?: number) => {
    openDeleteConfirmDialog();
    setDeletetedId(id as number);
  };

  async function deleteBook() {
    await request.delete(`books/${deletedId}`);
    await getBooks();
  }

  const statuses = ["New", "Reading", "Finished"];
  const statusColors = ["red", "yellow", "green"];

  return (
    <Paper elevation={3}>
      <Box
        p={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h6">Book List</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={openBookFormDialog}
        >
          Add Book
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>ISBN</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Published</TableCell>
              <TableCell>Pages</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableSkeleton row={5} column={8} />
            ) : books ? (
              books?.map(({ book, status }) => (
                <TableRow key={book.isbn}>
                  <TableCell>
                    <LazyLoadImage
                      height="100"
                      width="100"
                      effect="blur"
                      src={book.cover}
                      alt={book.title}
                      style={{ objectFit: "contain" }}
                    />
                  </TableCell>
                  <TableCell>{book.isbn}</TableCell>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.published}</TableCell>
                  <TableCell>{book.pages}</TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      labelId="status-select-label"
                      value={status.toString()}
                      onChange={(event: SelectChangeEvent<string>) =>
                        changeStatus(event, book)
                      }
                      label="Status"
                      sx={{
                        "& .MuiSelect-select": {
                          color: statusColors[status],
                        },
                      }}
                    >
                      {statuses.map((status, i) => (
                        <MenuItem sx={{ color: statusColors[i] }} value={i}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <LoadingButton
                      onClick={() => openDeleteConfirmDialogBtn(book.id)}
                      variant="contained"
                      color="error"
                    >
                      <DeleteIcon />
                    </LoadingButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableCell colSpan={8}>
                <Empty />
              </TableCell>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {BookFormDialog}
      {DeleteConfirmDialog}
    </Paper>
  );
};

export default BooksPage;
