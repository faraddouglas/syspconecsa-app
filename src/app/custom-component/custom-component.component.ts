import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-custom-component',
  templateUrl: './custom-component.component.html',
  styleUrls: ['./custom-component.component.scss'],
})
export class CustomComponent implements OnInit {

  constructor(private readonly alertController: AlertController) { }

  ngOnInit() {}

  async presentAlert(header: string, subHeader: string, message: string, buttons: string[]){
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: buttons
    });
    await alert.present();
  };
};
