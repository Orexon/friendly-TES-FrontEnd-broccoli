import { QuestionResultInfo } from './QuestionResultInfo';

export class ResultInfo {
  testName: string;
  startedAt: Date;
  minutesOvertime: number;
  totalPoints: number;
  questionResults: QuestionResultInfo[];
  email: string;
  firstName: string;
  lastName: string;
}
