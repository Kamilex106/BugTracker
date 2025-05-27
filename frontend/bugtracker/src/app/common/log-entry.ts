export interface LogEntry {
  id: number;
  bugReport: {
    id: number;
    user: {
      id: number;
      username: string;
      email: string;
    };
  };
  bugStatus: {
    id: number;
    name: string;
  };
  comment: string;
  date: string;
}
