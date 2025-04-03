export class User {
  constructor(
    public id?: number,
    public username?: string,
    public email?: string,
    public password?: string,
    public enabled?: boolean,
    public roles?: Array<{id?: number, name?: string}>
  ) {}
}
