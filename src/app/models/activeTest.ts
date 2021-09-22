import { Guid } from 'guid-typescript';
import { Question, QuestionList } from './question';
import { TestLink } from './testLink';
import { StateType } from './testType';

export class ActiveTest {
  id: Guid;
  name: string;
  description: string;
  questions?: QuestionList[];
  testType: StateType;
  createTime: Date;
  validFrom: Date;
  validTo: Date;
  timeLimit: BigInt;
  urlLinkId: TestLink;
}
