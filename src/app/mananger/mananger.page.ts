import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mananger',
  templateUrl: './mananger.page.html',
  styleUrls: ['./mananger.page.scss'],
})
export class ManangerPage implements OnInit {

  constructor( private router: Router) { }

  ngOnInit() {
  }

  redirectToRegisterEnterprise(){
    this.router.navigate(['/page/mananger/register-enterprise']);
  }
}
