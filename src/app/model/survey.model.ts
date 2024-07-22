export interface Option {
    optionId: string;
    optionValue: string;
  }
  
  export interface Question {
    questionId: string;
    category: string;
    label: string;
    options: Option[];
    maxRating: number;
    status: boolean;
  }
  
  export interface Survey {
    surveyId: string;
    creatorId: string;
    title: string;
    summary: string;
    createdAt: string;
    updatedAt: string;
    questions: Question[];
    status: boolean;
    enabled: boolean;
  }
  