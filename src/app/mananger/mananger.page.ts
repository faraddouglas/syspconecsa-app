import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-mananger',
  templateUrl: './mananger.page.html',
  styleUrls: ['./mananger.page.scss'],
})
export class ManangerPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  redirectToRegisterEnterprise(){
    this.navCtrl.navigateForward('/register-enterprise');
  }

}
