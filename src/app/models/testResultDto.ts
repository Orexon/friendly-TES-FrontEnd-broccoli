import { Guid } from 'guid-typescript';

export class TestResultDto {
  id: Guid;
  testId: Guid;
  testName: string;
  applicantId: Guid;
  applicantEmail: string;
  applicantFirstName: string;
  applicantLastName: string;
  startedAt: Date;
  minutesOvertime: number;
  totalPoints: number;
}
