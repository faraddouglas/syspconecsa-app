import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterEnterpriseService } from './register-enterprise.service';
import { CustomComponent } from 'src/app/custom-component/custom-component.component';


@Component({
  selector: 'app-register-enterprise',
  templateUrl: './register-enterprise.page.html',
  styleUrls: ['./register-enterprise.page.scss'],
})
export class RegisterEnterprisePage implements OnInit {
  formGroup!: FormGroup;
  register: string = '';
  zipCode: string = '';
  enterprise: string = '';
  fantasyName: string = '';
  email: string = '';
  phone: string = '';
  adress: string = '';
  adressNum: string = '';
  adressComplement: string = '';
  district: string = '';
  city: string = '';
  state: string = '';
  country: string = '';
  website: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private registerEnterpriseService: RegisterEnterpriseService,
    private customComponent: CustomComponent
    ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      register: ['', [Validators.required, Validators.pattern(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/)]],
      enterprise: ['', [Validators.required]],
      fantasyName: ['', [Validators.nullValidator]],
      email: ['', [Validators.required, Validators.pattern(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i)]],
      phone: ['', [Validators.required, Validators.pattern(/^\([1-9]{2}\)\s*9?[0-9]{1}[0-9]{3}\-[0-9]{4}$/)]],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}\-\d{3}$/)]],
      adress: ['', [Validators.required]],
      adressNum: ['', [Validators.required]],
      adressComplement: ['', [Validators.nullValidator]],
      district: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
    });
  };

  sendCnpjMask(){
    if (this.register.length == 2) {
      this.register = this.register + '.';
    } else if (this.register.length == 6) {
      this.register = this.register + '.';
    }
    else if (this.register.length == 10) {
      this.register = this.register + '/';
    }
    else if (this.register.length == 15) {
      this.register = this.register + '-';
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

  registerEnterprise(){
    const enterprise = {
      companyId: this.register,
      enterprise: this.enterprise,
      fantasyName: this.fantasyName,
      dateRecord: new Date().toLocaleDateString(),
      adress: this.adress,
      adressNum: this.adressNum,
      adressComplement: this.adressComplement,
      district: this.district,
      city: this.city,
      state: this.state,
      zipCode: this.zipCode,
      country: this.country,
      phone: this.phone,
      email: this.email,
      website: this.website
    };
    this.registerEnterpriseService.postEnterprise(enterprise);
    this.customComponent.presentAlert(
      'Sucesso',
      'Empresa cadastrada com sucesso!',
      'Agora você pode cadastrar seus funcionários.',
      ['OK']
    );
  };
};
