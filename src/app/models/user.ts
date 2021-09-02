import { Guid } from 'guid-typescript';

export class User {
  id: Guid;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  token?: string;
}
