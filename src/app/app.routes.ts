import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/register/register.component';  
import { HomeComponent } from './pages/home/home.component';
import { FormDetailComponentComponent } from './pages/form-detail-component/form-detail-component.component';
import { CreateSurveyComponent } from './pages/create-survey/create-survey.component';
import { TakesurveyComponent } from './pages/takesurvey/takesurvey.component';
import { ReportComponent } from './pages/report/report.component';
import { SurveyreportComponent } from './pages/surveyreport/surveyreport.component';



export const routes: Routes = [
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "signup",
    component: SignUpComponent
  },
  {
    path: "home",
    component: HomeComponent
  },

  { path: 'form/:id', component: FormDetailComponentComponent },

  {
    path: 'createsurvey', component: CreateSurveyComponent
  },

  {
    path:'takesurvey', component:TakesurveyComponent
  },

  {
    path:'report', component:ReportComponent
  },

  {
    path:'surveyreport', component:SurveyreportComponent
  }
  
 
 
];
