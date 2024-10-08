import { useCallback, useEffect, useState } from "react";

import request from "../server/request";
import { Book } from "../types";
import { SelectChangeEvent } from "@mui/material";

const useFetchBooks = () => {
  const [books, setBooks] = useState<{ book: Book; status: number }[] | null>(
    null
  );
  const [loading, setLoading] = useState(false);

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

  const changeStatus = async (e: SelectChangeEvent<string>, book: Book) => {
    await request.patch(`books/${book.id}`, { book, status: e.target.value });
    await getBooks();
  };

  return { books, loading, getBooks, changeStatus };
};

export default useFetchBooks;
