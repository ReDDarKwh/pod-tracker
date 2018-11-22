import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { PasswordValidation } from 'src/app/password.validator';
import { AuthenticationService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthenticationService,
    private router: Router
  ) {
    this.formGroup = formBuilder.group(
      {
        fieldUsername: ['', Validators.compose([Validators.required])],
        fieldPassword: ['', Validators.compose([Validators.required])],
        fieldConfirmPassword: ['', Validators.compose([Validators.required])]
      },
      {
        validator: PasswordValidation.MatchPassword
      }
    );
  }

  getField(controlName: string) {
    return this.formGroup.get(controlName);
  }

  getErrorMessage(controlName: string) {
    return this.getField(controlName).hasError('required')
      ? 'You must enter a value'
      : this.getField(controlName).hasError('MatchPassword')
      ? 'Password does not match'
      : '';
  }

  submit() {
    this.auth
      .register(
        this.getField('fieldUsername').value,
        this.getField('fieldPassword').value
      )
      .subscribe(() => {
        this.router.navigate(['/login']);
      });
  }

  ngOnInit() {}
}
