import { useState, useEffect } from "react";
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
  Typography,
  Box,
  Skeleton,
} from "@mui/material";
import request from "../server/request";
import Empty from "../components/Empty";
import { Book } from "../types";

const SearchBooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  useEffect(() => {
    const searchBooks = async () => {
      if (debouncedSearchTerm) {
        try {
          setLoading(true);
          const res = await request.get(`books/${debouncedSearchTerm}`);
          setBooks(res.data.data);
        } finally {
          setLoading(false);
        }
      } else {
        setBooks([]);
      }
    };

    searchBooks();
  }, [debouncedSearchTerm]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Paper elevation={3}>
      <Box
        p={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h6">Searching books</Typography>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          onChange={handleSearch}
        />
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
                </TableRow>
              ))
            ) : books.length !== 0 ? (
              books.map((book) => (
                <TableRow key={book.isbn}>
                  <TableCell>
                    <LazyLoadImage
                      height="100"
                      width="100"
                      src={book.cover}
                      alt={book.title}
                      effect="blur"
                      style={{ objectFit: "contain" }}
                    />
                  </TableCell>
                  <TableCell>{book.isbn}</TableCell>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.published}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableCell colSpan={5}>
                <Empty />
              </TableCell>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default SearchBooksPage;
