import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-register-enterprise',
  templateUrl: './register-enterprise.page.html',
  styleUrls: ['./register-enterprise.page.scss'],
})
export class RegisterEnterprisePage implements OnInit {
  formGroup!: FormGroup;
  cnpj: string = '';
  zipCode: string = '';
  name: string = '';
  email: string = '';
  phone: string = '';
  adress: string = '';
  adressNum: string = '';
  district: string = '';
  city: string = '';
  state: string = '';
  country: string = '';

  constructor(private formBuilder: FormBuilder) { }


  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      cnpj: ['', [Validators.required, Validators.pattern(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/)]],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i)]],
      phone: ['', [Validators.required, Validators.pattern(/^\([1-9]{2}\)\s*9?[0-9]{1}[0-9]{3}\-[0-9]{4}$/)]],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}\-\d{3}$/)]],
      adress: ['', [Validators.required]],
      adressNum: ['', [Validators.required]],
      district: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
    });
  };

  sendCnpjMask(){
    if (this.cnpj.length == 2) {
      this.cnpj = this.cnpj + '.';
    } else if (this.cnpj.length == 6) {
      this.cnpj = this.cnpj + '.';
    }
    else if (this.cnpj.length == 10) {
      this.cnpj = this.cnpj + '/';
    }
    else if (this.cnpj.length == 15) {
      this.cnpj = this.cnpj + '-';
    }
  }

  sendZipCodeMask(){
    if (this.zipCode.length == 5) {
      this.zipCode = this.zipCode + '-';
    }
  }

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
    }
  }

  numericOnly(){
    addEventListener('numericOnly', (event: any) => {
      event.target.value = event.target.value.replace(/[^0-9]/g, '');
    });
  }
};
