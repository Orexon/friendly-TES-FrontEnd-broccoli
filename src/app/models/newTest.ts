import { Guid } from 'guid-typescript';
import { NewQuestion } from './question';
import { StateType } from './testType';

export class NewTest {
  id?: Guid;
  name: string;
  description: string;
  questions: NewQuestion[];
  testType: StateType;
  validFrom: Date;
  validTo: Date;
  timeLimit: {};
}
