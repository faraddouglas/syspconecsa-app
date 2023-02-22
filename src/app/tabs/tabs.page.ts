import { NavController } from '@ionic/angular';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor( private navCtrl:NavController ) {}

  navigateTabs(page: string){
    this.navCtrl.navigateForward(page);
  }
}
