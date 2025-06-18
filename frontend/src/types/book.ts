export interface Book {
  id: number;
  title: string;
  filename: string;
  mimetype: string;
  owner_id: number;
}

export interface BookWithProgress extends Book {
  progress?: {
    position: string;
  };
}
