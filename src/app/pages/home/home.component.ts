import { Component, OnInit } from '@angular/core';
import { SurveyService } from '../../survey.service';
import { Survey } from '../../model/survey.model';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  surveys$: Observable<Survey[]> | undefined;

  constructor(private surveyService: SurveyService, private router: Router,) {}

  ngOnInit(): void {
    this.surveys$ = this.surveyService.getSurveys();
  }

  takeSurvey(survey: Survey): void {
    
    // Implement the logic to handle the survey taking process
    console.log('Taking survey:', survey);
   // survey: JSON.stringify(survey);
   //console.log(survey,"fghj")
   const surveyUrl = `http://localhost:4200/takesurvey?id=${survey.surveyId}`;
    
   // Copy the URL to the clipboard
   this.copyToClipboard(surveyUrl);
  // this.router.navigate(['/takesurvey'], { queryParams: { id: survey.surveyId } });

  }
  copyToClipboard(text: string): void {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    // Optionally, you can alert the user that the URL was copied
    alert('Survey link copied to clipboard!');
  }
  navigate() {
    this.router.navigate(["createsurvey"]);
  }
  navigatetakesurvey() {
    this.router.navigate(["takesurvey"]);
  }
  navigatereport() {
    this.router.navigate(['/report']); // Replace '/report' with your desired route
  }
  navigatesurveyreport(survey: Survey):void{
    this.router.navigate(['/surveyreport'], { queryParams: { id: survey.surveyId } });

    
  }

}