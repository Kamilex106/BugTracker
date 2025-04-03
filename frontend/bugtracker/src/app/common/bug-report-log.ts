export class BugReportLog {
  constructor(
    public id?: number,
    public comment?: string,
    public date?: string,
    public bugReport?: any,
    public bugStatus?: any,
    public _links?: any
  ) {}
}
