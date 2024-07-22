import { Injectable } from '@angular/core';
import { Survey } from './model/survey.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  private apiUrl = 'http://localhost:8081/survey'; // Update this to your actual backend API
  private surveysSubject = new BehaviorSubject<Survey[]>([]);

  constructor() {
    this.fetchSurveys();
  }

  fetchSurveys(): void {
    fetch(this.apiUrl, {
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
      .then((data: Survey[]) => {
        this.surveysSubject.next(data); // Update the BehaviorSubject with the fetched data
      })
      .catch(error => {
        console.error('Error making GET request:', error);
        this.surveysSubject.error(error); // Emit the error through the BehaviorSubject
      });
  }

  getSurveys(): Observable<Survey[]> {
    return this.surveysSubject.asObservable();
  }
}