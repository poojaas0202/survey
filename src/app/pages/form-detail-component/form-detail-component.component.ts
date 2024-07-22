import { Component, OnInit } from '@angular/core';
import { FormService } from '../../form.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-detail-component',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './form-detail-component.component.html',
  styleUrl: './form-detail-component.component.css'
})
export class FormDetailComponentComponent implements OnInit{
  form: any;
  currentQuestionIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private formService: FormService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const formId = params['id'];
      console.log(formId)
      this.form = this.formService.getForm(formId);
      console.log(this.form)
    });
  }

  get currentQuestion() {
    return this.form.questions[this.currentQuestionIndex];
  }

  onSaveAndContinue() {
    // Save the answer for the current question
    // ...

    // Move to the next question
    this.currentQuestionIndex++;
  }
}


