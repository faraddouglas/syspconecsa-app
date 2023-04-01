import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.page.html',
  styleUrls: ['./register-user.page.scss'],
})
export class RegisterUserPage implements OnInit {
  formGroup!: FormGroup;
  companyId: string = JSON.parse(localStorage.getItem('user') || '{}').companyId;
  enterprise: string = JSON.parse(localStorage.getItem('user') || '{}').enterprise;
  dateRecord: string =  Date.now().toString();
  name: string = '';
  userId: string = '';
  userType: string = '';
  hasInterval: boolean = false;
  address: string = '';
  city: string = '';
  state: string = '';
  zip: string = '';
  country: string = '';
  phone: string = '';
  email: string = '';

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
      this.formGroup = this.formBuilder.group({
        name: ['', Validators.required],
        userId: ['', Validators.required],
        userType: ['', Validators.required],
        hasInterval: [false],
        address: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zip: ['', Validators.required],
        country: ['', Validators.required],
        phone: ['', Validators.required],
        email: ['', Validators.email],
    });
  }
}
