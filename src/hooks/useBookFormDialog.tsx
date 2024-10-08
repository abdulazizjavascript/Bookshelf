import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  TextField,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { LoadingButton } from "@mui/lab";

import request from "../server/request";

const isbnRegex = /^(?:\d{10}|\d{13})$/;

interface Isbn {
  isbn: string;
}

const useBookFormDialog = ({ getBooks }: { getBooks: () => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Isbn>();

  const [addBtnLoading, setAddBtnLoading] = useState(false);

  const [isBookFormDialogOpen, setIsBookFormDialogOpen] = useState(false);

  const addBook = async (data: Isbn) => {
    try {
      setAddBtnLoading(true);
      await request.post("books", data);
      await getBooks();
      closeBookFormDialog();
      reset({ isbn: "" });
    } finally {
      setAddBtnLoading(false);
    }
  };

  const openBookFormDialog = () => {
    setIsBookFormDialogOpen(true);
  };

  const closeBookFormDialog = () => {
    setIsBookFormDialogOpen(false);
  };

  const BookFormDialog = (
    <Dialog
      PaperProps={{ sx: { maxWidth: "600px", width: "100%" } }}
      open={isBookFormDialogOpen}
      onClose={closeBookFormDialog}
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
          <Button onClick={closeBookFormDialog} color="secondary">
            Cancel
          </Button>
          <LoadingButton loading={addBtnLoading} type="submit" color="primary">
            Add Book
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );

  return { BookFormDialog, openBookFormDialog };
};

export default useBookFormDialog;
