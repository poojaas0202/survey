import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http';

interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    // HttpClient
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup<LoginForm>;

  constructor(
    private router: Router,
    // private http: HttpClient,
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    } as LoginForm);
  }

  submit() {
    console.log(this.loginForm.value, "values");
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      const body = { email: email, password: password };
      fetch("http://localhost:8081/auth/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
      .then(response => {
        if (!response.ok) {
          // Handle HTTP errors
          return response.json().then(errorData => {
            throw new Error(errorData.message || 'Something went wrong');
          });
        }
        return response.json();
      })
      .then(data => {
        console.log('POST request successful:', data);
        //alert("Login Successful");
        localStorage.setItem("user", data.name);
        localStorage.setItem("token", data.token);

        this.navigate();
      })
      .catch(error => {
        console.error('Error making POST request:', error);
        // Handle different error messages
        if (error.message.includes('User already exists')) {
          alert('User already exists. Please try logging in.');
        } else if (error.message.includes('Incorrect password')) {
          alert('Incorrect password. Please try again.');
        } else {
          alert('An error occurred: ' + error.message);
        }
      });
    }
  }

  navigate() {
    this.router.navigate(["home"]);
  }
}
