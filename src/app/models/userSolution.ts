import { Guid } from 'guid-typescript';
import { Applicant } from './applicant';
import { Question } from './question';
import { Test } from './test';

export class UserSolution {
  Id: Guid;
  Test: Test;
  Question: Question;
  submitedFilePath: string;
  minutesOvertime: number;
  applicantId: Applicant;
  pointsScored: number;
}
