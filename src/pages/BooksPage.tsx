import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LazyLoadImage } from "react-lazy-load-image-component";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  Skeleton,
  SelectChangeEvent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { LoadingButton } from "@mui/lab";

import Empty from "../components/Empty";

import request from "../server/request";
import { Book } from "../types";
import useDeleteConfirmDialog from "../hooks/useDeleteConfirmDialog";

const isbnRegex = /^(?:\d{10}|\d{13})$/;

interface Isbn {
  isbn: string;
}

const BooksPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Isbn>();

  const { DeleteConfirmDialog, openDeleteConfirmDialog } =
    useDeleteConfirmDialog(deleteBook);

  const [books, setBooks] = useState<{ book: Book; status: number }[] | null>(
    null
  );

  const [loading, setLoading] = useState(false);
  const [addBtnLoading, setAddBtnLoading] = useState(false);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [deletedId, setDeletetedId] = useState<number | null>(null);

  const getBooks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await request.get("books");

      setBooks(res.data.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getBooks();
  }, [getBooks]);

  const addBook = async (data: Isbn) => {
    try {
      setAddBtnLoading(true);
      await request.post("books", data);
      await getBooks();
      closeAddDialog();
      reset({ isbn: "" });
    } finally {
      setAddBtnLoading(false);
    }
  };

  const openAddDialog = () => {
    setIsAddDialogOpen(true);
  };

  const closeAddDialog = () => {
    setIsAddDialogOpen(false);
  };

  const changeStatus = async (e: SelectChangeEvent<string>, book: Book) => {
    await request.patch(`books/${book.id}`, { book, status: e.target.value });
    await getBooks();
  };

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
          onClick={openAddDialog}
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
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton variant="text" height={30} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" height={30} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" height={30} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" height={30} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" height={30} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" height={30} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" height={30} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" height={30} />
                  </TableCell>
                </TableRow>
              ))
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
      <Dialog
        PaperProps={{
          sx: {
            maxWidth: "600px",
            width: "100%",
          },
        }}
        open={isAddDialogOpen}
        onClose={closeAddDialog}
      >
        <form onSubmit={handleSubmit(addBook)}>
          <DialogContent>
            <TextField
              label="ISBN"
              variant="outlined"
              fullWidth
              {...register("isbn", {
                required: "ISBN is required",
                pattern: {
                  value: isbnRegex,
                  message: "Invalid ISBN. Please enter a valid ISBN.",
                },
              })}
              error={!!errors.isbn}
              helperText={errors.isbn ? errors.isbn.message : ""}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeAddDialog} color="secondary">
              Cancel
            </Button>
            <LoadingButton
              loading={addBtnLoading}
              type="submit"
              color="primary"
            >
              Add Book
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
      {DeleteConfirmDialog}
    </Paper>
  );
};

export default BooksPage;
