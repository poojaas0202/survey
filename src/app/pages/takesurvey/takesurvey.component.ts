import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-takesurvey',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './takesurvey.component.html',
  styleUrls: ['./takesurvey.component.css']
})
export class TakesurveyComponent implements OnInit {
  currentAnswer1: string[] = [];
  survey: any;
  step: number = 0;
  currentQuestion: any;
  currentAnswer: any;
  answers: any = {};
  surveyForm: FormGroup;
  filteredResponses: any;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router) {
    this.surveyForm = this.fb.group({
      options: this.fb.array([])
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const surveyId = params['id'];
      if (surveyId) {
        this.fetchSurvey(surveyId);
      }
    });
    this.getAllResponses();
  }

  fetchSurvey(surveyId: string) {
    fetch(`http://localhost:8081/survey/${surveyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errorData => {
            throw new Error(errorData.message || 'Something went wrong');
          });
        }
        return response.json();
      })
      .then(data => {
        this.survey = data;
        this.loadCurrentQuestion();
      })
      .catch(error => {
        console.error('Error fetching survey data:', error);
      });
  }

  loadCurrentQuestion() {
    if (this.step >= 1 && this.step <= this.survey.questions.length) {
      this.currentQuestion = this.survey.questions[this.step - 1];
      const savedAnswers = this.answers[this.currentQuestion.questionId]?.[0]?.response || [];
      this.currentAnswer = Array.isArray(savedAnswers) ? savedAnswers : [];
    }
  }

  onCheckboxChange(event: any, value: string) {
    if (event.target.checked) {
      this.currentAnswer1.push(value);
    } else {
      const index = this.currentAnswer1.indexOf(value);
      if (index > -1) {
        this.currentAnswer1.splice(index, 1);
      }
    }
  }

  get options() {
    return this.surveyForm.get('options') as FormArray;
  }

  nextStep() {
    this.saveAnswer();
    this.step++;
    this.loadCurrentQuestion();
  }

  saveAnswer() {
    if (this.currentQuestion) {
      if (this.currentQuestion.category === 'MULTIOPTION') {
        this.answers[this.currentQuestion.questionId] = [{
          questionId: this.currentQuestion.questionId,
          response: this.currentAnswer1,
          type: this.currentQuestion.category
        }];
      } else {
        const response = {
          questionId: this.currentQuestion.questionId,
          response: this.currentAnswer,
          type: this.currentQuestion.category
        };
        this.answers[this.currentQuestion.questionId] = [response];
      }
    }
  }

  async updateResponses(surveyId: string, finalResponse: any) {
    const response = await fetch(`http://localhost:8081/responses/${surveyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(finalResponse)
    });
    if (!response.ok) {
      const errorData = await response;
      throw new Error('Error updating response');
    }
    return await response;
  }

  async createResponses(finalResponse: any) {
    console.log(finalResponse)
    const response = await fetch(`http://localhost:8081/responses`, {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(finalResponse)
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error creating response');
    }
    return await response.json();
  }

  async getAllResponses() {
    const response = await fetch(`http://localhost:8081/responses`);
    if (!response.ok) {
      throw new Error('Error fetching responses');
    }
    return await response.json();
  }

  async submitSurvey() {
    this.saveAnswer();
    const surveyId = this.route.snapshot.queryParams['id'];
    const finalResponse = {
      userId: localStorage.getItem('user'),
      responses: Object.values(this.answers).flat()
    };
    console.log('Final response:', finalResponse);

    try {
      const allResponses = await this.getAllResponses();
      const existingResponse = allResponses.find((response: any) => response.surveyId === surveyId);

      if (existingResponse) {
        await this.updateResponses(surveyId, finalResponse);
      } else {
        const finalResponse = {
          surveyId: this.survey.surveyId,
          responses: [
            {
              userId: sessionStorage.getItem('user'),
              responses: Object.values(this.answers).flat()
            }
          ]
        };
        await this.createResponses(finalResponse);

      }

      alert("Submitted successfully");
    } catch (error) {
      console.error('Error:', error);
      alert("Error in submitting the response");
    }
  }
}
