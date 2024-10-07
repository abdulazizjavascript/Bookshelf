export interface User {
  name: string;
  email: string;
}

export interface Book {
  id?: number;
  isbn: string;
  title: string;
  cover: string;
  author: string;
  published: string;
  pages: number;
}
