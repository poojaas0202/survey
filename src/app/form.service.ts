import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  forms = [
    {
      id: 1,
      name: 'Customer Satisfaction Survey',
      description: 'Gather feedback from customers about their experience',
      questions: [
        {
          id: 1,
          question: 'How satisfied are you with our product?',
          answers: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied']
        },
        {
          id: 2,
          question: 'How likely are you to recommend our product to a friend?',
          answers: ['Very Likely', 'Likely', 'Neutral', 'Unlikely', 'Very Unlikely']
        }
      ]
    },
    {
      id: 2,
      name: 'Employee Feedback Form',
      description: 'Collect feedback from employees about their work experience',
      questions: [
        {
          id: 1,
          question: 'How satisfied are you with your job?',
          answers: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied']
        },
        {
          id: 2,
          question: 'Do you feel your work is valued by the company?',
          answers: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree']
        }
      ]
    }
  ];


  constructor() { 
   
  }
  getForms() {
    return this.forms;
  }
  getForm(formId: number) {
    console.log(formId)
    return this.forms.find(form => form.id == formId);
  }
}
