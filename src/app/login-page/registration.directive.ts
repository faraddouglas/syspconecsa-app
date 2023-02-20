import { Directive } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

@Directive({
  selector: '[appRegistration]'
})
export class RegistrationDirective {

  constructor() { }
}
