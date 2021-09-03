import { Guid } from 'guid-typescript';
import { QuestionType } from './questionType';

export class Question {
  id: Guid;
  name: string;
  description: string;
  questionType: QuestionType;
  SolutionFilePath: string;
  worthOfPoints: number;
}
