import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterUserService } from './register-user.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.page.html',
  styleUrls: ['./register-user.page.scss'],
})
export class RegisterUserPage implements OnInit {

  formGroup!: FormGroup;
  companyId: string = JSON.parse(localStorage.getItem('user') || '{}').companyId;
  enterprise: string = JSON.parse(localStorage.getItem('user') || '{}').enterprise;
  dateRecord: string =  new Date().toLocaleDateString();
  name: string = '';
  userId: string = '';
  userType: string = '';
  hasInterval: boolean = true;
  address: string = '';
  city: string = '';
  state: string = '';
  zipCode: string = '';
  country: string = '';
  phone: string = '';
  email: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private registerUserService: RegisterUserService,
  ) { }

  ngOnInit() {
      this.formGroup = this.formBuilder.group({
        name: ['', Validators.required],
        userId: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/)]],
        userType: ['', Validators.required],
        hasInterval: [false],
        address: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zipCode: ['', Validators.required],
        country: ['', Validators.required],
        phone: ['', Validators.required],
        email: ['', Validators.email],
    });
  };

  sendZipCodeMask() {
    if (this.zipCode.length === 5) {
      this.zipCode = this.zipCode + '-';
    };
  };

  numericOnly(){
    addEventListener('numericOnly', (event: any) => {
      event.target.value = event.target.value.replace(/[^0-9]/g, '');
    });
  };

  sendCpfMask(){
    if (this.userId.length == 3) {
      this.userId = this.userId + '.';
    } else if (this.userId.length == 7) {
      this.userId = this.userId + '.';
    }
    else if (this.userId.length == 11) {
      this.userId = this.userId + '-';
    };
  };

  sendPhoneMask(){
    if (this.phone.length == 1 && this.phone != '(' && this.phone != ')') {
      this.phone = '(' + this.phone;
    } else if (this.phone.length == 3) {
      this.phone = this.phone + ') ';
    } else if (this.phone.length == 4) {
      this.phone = this.phone + ' ';
    } else if (this.phone.length == 9 && this.phone[5] != '9') {
      this.phone = this.phone + '-';
    } else if (this.phone.length == 10 && this.phone[5] == '9') {
      this.phone = this.phone + '-';
    };
  };

  async registerUser() {
    const newUser = {
      companyId: this.companyId,
      enterprise: this.enterprise,
      dateRecord: this.dateRecord,
      name: this.name,
      userId: Number(this.userId.replace(/\D/g, '')),
      userType: this.userType,
      hasInterval: this.hasInterval,
      address: this.address,
      city: this.city,
      state: this.state,
      zipCode: this.zipCode,
      country: this.country,
      phone: this.phone,
      email: this.email,
    };
    await this.registerUserService.postUser(newUser);
  };
};
