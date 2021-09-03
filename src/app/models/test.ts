import { Guid } from 'guid-typescript';
import { Question } from './question';
import { TestLink } from './testLink';
import { TestType } from './testType';

export class Test {
  id: Guid;
  name: string;
  description: string;
  questions: Question[];
  testType: TestType;
  createTime: Date;
  validFrom: Date;
  validTo: Date;
  timeSpan: number;
  testLink: TestLink;
}
