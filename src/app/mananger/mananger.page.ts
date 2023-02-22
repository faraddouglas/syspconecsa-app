import { AuthGuard } from './../guards/auth.guard';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mananger',
  templateUrl: './mananger.page.html',
  styleUrls: ['./mananger.page.scss'],
})
export class ManangerPage implements OnInit {

  constructor(private navCtrl: NavController, private auth: AuthGuard, private router: Router) { }

  ngOnInit() {
  }

  redirectToRegisterEnterprise(){
    this.router.navigate(['/page/mananger/register-enterprise']);
  }
}
