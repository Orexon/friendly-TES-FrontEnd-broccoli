import { Guid } from 'guid-typescript';
import { QuestionType } from './questionType';

export class NewQuestion {
  id?: Guid;
  name: string;
  description: string;
  questionType: QuestionType;
  SubmittedSolution: File;
  worthOfPoints: number;
}

export class Question {
  id?: Guid;
  name: string;
  description: string;
  questionType: QuestionType;
  solutionFilePath: string;
  worthOfPoints: number;
}
export class QuestionList {
  id: Guid;
  name: string;
  description: string;
  questionType: QuestionType;
  worthOfPoints: number;
}
