// comment.ts (create this file in your models folder if needed)
export interface Comment {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
  };
  bugReport: {
    id: number;
  };
  comment: string;
  date: string;
}
