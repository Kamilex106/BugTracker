import {Category} from './category';
import {User} from './user';
import {BugStatus} from './bug-status';

export class BugReport {
  constructor(
    public id?: number,
    public title?: string,
    public description?: string,
    public priority?: string,
    // ponizsze dane zachowane dla przypadku
    // w ktorym nie stosujemy domyslnego usera
    // => nie przypisujemy w kodzie o id = 2
    // public user: {
    //   id?: number,
    //   username?: string,
    //   email?: string,
    //   enabled?: boolean,
    //   roles?: Array<{id?: number, name?: string}>
    // } = { id: 2 },
    public createdAt?: string,
    // public actualStatus: { id: number } = { id: 1 },  // Object with id
    // public category: { id: number } = { id: 1 },      // Object with id
    public category?: Category,
    public actualStatus?: BugStatus,
    // public user: { id: number } = { id: 2 },  // nie usuwac
    public user?: User,  // Keep as object
    public _links?: any
  ) {}
}
