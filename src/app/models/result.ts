import { ApplicationInitStatus } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Applicant } from './applicant';
import { Test } from './test';
import { UserSolution } from './userSolution';

export class Result {
  id: Guid;
  test: Test;
  applicant: Applicant;
  minutesOvertime: number;
  startedAt: Date;
  userSolutions: UserSolution[];
  totalPoints: number;
}

export class ResultSimplyfied {
  Id: Guid;
  TestId: Guid;
  ApplicantId: Guid;
  TestName: string;
  ApplicantEmail: string;
  TotalPoints: number;
  QuestionCount: number;
  Overtime: number;
}
