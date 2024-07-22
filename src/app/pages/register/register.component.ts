import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
//import { HttpClient } from '@angular/common/http';


interface SignupForm {
  name: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  passwordConfirm: FormControl<string>;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    // HttpClient
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class SignUpComponent {
  signupForm: FormGroup<SignupForm>;

  constructor(
    private router: Router,
    // private http: HttpClient,
    
  ) {
    this.signupForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(6)]),
    } as SignupForm);
  }

  submit() {
    console.log(this.signupForm.value, "values");
    if (this.signupForm.valid) {
      const { name, email, password } = this.signupForm.value;
      
      const body ={"name":name,"email":email,"password":password}
      fetch("http://localhost:8081/auth/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
      .then(response => response.json())
      .then(data => {
        console.log('POST request successful:', data);
        if(data.success){
          alert(data.message)
          sessionStorage.setItem("user",data.name)
          sessionStorage.setItem("token",data.token)

        }
        else{
          alert(data.message)
        }
       
        this.navigate();
        // Handle the successful response
      })
      .catch(error => {
        console.error('Error making POST request:', error);
        // Handle the error
      });
    }
  }

  navigate() {
    this.router.navigate(["login"]);
  }
}
