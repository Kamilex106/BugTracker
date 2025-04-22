import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-registration',
  standalone: false,
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  registrationForm = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  };
  errorMessage: any;
  successMessage: any;
  isLoading: any;

  constructor(private http: HttpClient) {}
  onSubmit(form: NgForm) {
    this.errorMessage = null;
    this.successMessage = null;
    this.isLoading = true;

    const requestBody = {
      firstName: this.registrationForm.firstName,
      lastName: this.registrationForm.lastName,
      email: this.registrationForm.email,
      password: this.registrationForm.password
    };

    this.http.post('http://localhost:8080/registration', requestBody).subscribe(
      (response: any) => {
        this.successMessage = response.message;
        this.errorMessage = null;
        this.isLoading = false;
        form.resetForm(); // <--- resetuje formularz po sukcesie
      },
      error => {
        this.errorMessage = error.error?.message || 'Wystąpił błąd podczas rejestracji';
        this.successMessage = null;
        this.isLoading = false;
      }
    );
  }


}
