// src/types/index.ts
export interface Assignment {
    id: number;
    date: string;
    QuestionName: string;
    Subject: string;
    Topic?: string;
    Link: string;
    sheetSource?: string; // Which sheet this assignment came from
  }
  
  export interface FilterOptions {
    subject?: string;
    sheetSource?: string;
    searchTerm?: string;
  }