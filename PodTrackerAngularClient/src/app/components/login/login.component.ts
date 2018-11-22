import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { PasswordValidation } from 'src/app/password.validator';
import { AuthenticationService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthenticationService,
    private router: Router
  ) {
    this.formGroup = formBuilder.group({
      fieldUsername: ['', Validators.compose([Validators.required])],
      fieldPassword: ['', Validators.compose([Validators.required])]
    });
  }

  getField(controlName: string) {
    return this.formGroup.get(controlName);
  }

  getErrorMessage(controlName: string) {
    return this.getField(controlName).hasError('required')
      ? 'You must enter a value'
      : 'Error';
  }

  submit() {
    this.auth
      .login(
        this.getField('fieldUsername').value,
        this.getField('fieldPassword').value
      )
      .subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
  }

  ngOnInit() {}
}
