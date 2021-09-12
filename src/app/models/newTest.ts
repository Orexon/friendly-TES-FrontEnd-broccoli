import { Question } from './question';
import { StateType } from './testType';
import { TimeSpan } from './timeLimit';

export class NewTest {
  name: string;
  description: string;
  questions: Question[];
  testType: StateType;
  validFrom: Date;
  validTo: Date;
  timeLimit: TimeSpan;
}
