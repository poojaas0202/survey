import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface SurveyOption {
  optionId: string;
  optionValue: string;
}

interface SurveyQuestion {
  questionId: string;
  category: string;
  label: string;
  options: SurveyOption[];
  
}

interface Survey {
  surveyId: string;
  creatorId: string;
  title: string;
  summary: string;
  createdAt: string;
 
  questions: SurveyQuestion[];
 
 
}

@Component({
  selector: 'app-create-survey',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.css']
})
export class CreateSurveyComponent implements OnInit {
  step: number = 1;
  questionType: string = 'single'; // default value
  responses: string[] = [];
  ratingOptions: number[] = [5, 10, 20]; // predefined options
  questions: SurveyQuestion[] = [];
  surveyForm!: FormGroup;

  constructor(private fb: FormBuilder,private router: Router) {}

  ngOnInit() {
    this.initSurveyForm();
  }

  initSurveyForm() {
    this.surveyForm = this.fb.group({
      surveyName: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onQuestionTypeChange(event: any) {
    this.questionType = event.target.value;
    this.responses = [];
  }

  addResponse() {
    const responseInput = (document.getElementById('response') as HTMLInputElement);
    if (responseInput.value) {
      this.responses.push(responseInput.value);
      responseInput.value = '';
    }
  }

  addCustomRating() {
    const customRatingInput = (document.getElementById('customRating') as HTMLInputElement);
    const customRating = parseInt(customRatingInput.value, 10);
    if (customRating && !this.ratingOptions.includes(customRating)) {
      this.ratingOptions.push(customRating);
      customRatingInput.value = '';
    }
  }

  saveAndContinue() {
    const questionLabel = (document.getElementById('questionLabel') as HTMLTextAreaElement).value;

    // Validate question label
    if (!questionLabel.trim()) {
      alert('Question label cannot be empty.');
      return;
    }

    let newQuestion: SurveyQuestion = {
      questionId: `q${this.questions.length + 1}`,
      category: this.getQuestionCategory(this.questionType),
      label: questionLabel,
      options: [],
      
     
    };

    if (this.questionType === 'single' || this.questionType === 'multiple' || this.questionType === 'rating') {
      if (this.responses.length === 0) {
        alert('Please add at least one response option.');
        return;
      }
      newQuestion.options = this.responses.map((response, index) => ({
        optionId: `opt${index + 1}`,
        optionValue: response
      }));
    } else if (this.questionType === 'rating') {
      const ratingSelect = (document.getElementById('rating') as HTMLSelectElement);
      const ratingValue = ratingSelect.value;
      if (!ratingValue) {
        alert('Please select a rating value.');
        return;
      }
      //newQuestion.maxRating = parseInt(ratingValue, 10);
    } else if (this.questionType === 'open-ended') {
      if (!questionLabel.trim()) {
        alert('Please provide a question label for the open-ended question.');
        return;
      }
    }

    this.questions.push(newQuestion);
    this.resetForm();
  }

  getQuestionCategory(type: string): string {
    switch (type) {
      case 'single':
        return 'SINGLEOPTION';
      case 'multiple':
        return 'MULTIOPTION';
      case 'open-ended':
        return 'OPENENDED';
      case 'rating':
        return 'RATING';
      default:
        return '';
    }
  }

  finish() {
    if (!this.surveyForm) {
      return; // Exit early if surveyForm is null
    }

    const surveyNameControl = this.surveyForm.get('surveyName');
    const descriptionControl = this.surveyForm.get('description');

    if (!surveyNameControl || !descriptionControl) {
      return; // Exit early if form controls are null
    }

    const survey: Survey = {
      surveyId: '5f9f1b9b9c9d440000d7d2b8',
      creatorId: 'user123',
      title: surveyNameControl.value,
      summary: `Survey: ${surveyNameControl.value} - ${descriptionControl.value}`,
      createdAt: new Date().toISOString(),
      
      questions: this.questions,
     
      
    };

    console.log('Finish', survey);

    // Send the survey object to your backend here
    fetch("http://localhost:8081/survey", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(survey)
    })
    .then(response => response.json())
    .then(data => {
      console.log('POST request successful:', data);
      if(data){
        alert("Successfully created")
        this.navigate();
    

      }
      else{
        alert("error in saving survey")
    
      }
     
     
      // Handle the successful response
    })
    .catch(error => {
      console.error('Error making POST request:', error);
      // Handle the error
    });
 
  }

  reset() {
    this.questions = [];
    this.resetForm();
  }
  resetbutton(){
    this.surveyForm.reset(); // Reset the form fields
    this.step = 1; // Reset the step to the initial step
  }

  

  resetForm() {
    this.responses = [];
    const questionLabel = document.getElementById('questionLabel') as HTMLTextAreaElement;
    if (questionLabel) {
      questionLabel.value = '';
    }

    const responseInput = document.getElementById('response') as HTMLInputElement;
    if (responseInput) {
      responseInput.value = '';
    }

    if (this.questionType === 'rating') {
      const ratingSelect = document.getElementById('rating') as HTMLSelectElement;
      if (ratingSelect) {
        ratingSelect.value = this.ratingOptions[0].toString();
      }
    }
  }
  next() {
    // Implement any logic needed before moving to the next step
    this.step++; // Increment the step to move to the next section
  }
  navigate() {
    this.router.navigate(["home"]);
  }
}