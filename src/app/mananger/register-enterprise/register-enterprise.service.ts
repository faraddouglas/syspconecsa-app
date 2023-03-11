import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

@Injectable({
providedIn: 'root'
})

export class RegisterEnterpriseService {

  constructor(
    private http: HttpClient,
    private alertController: AlertController,
    ) {}

  async getEnterprise() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Conection': 'keep-alive',
      'Accept': '*/*'
    });
    return lastValueFrom( this.http.get<any>('https://syspteste.herokuapp.com/api/enterprises', { headers: headers }))
  }

  async postEnterprise(enterprise: object) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Conection': 'keep-alive',
      'Accept': '*/*'
    });
    return lastValueFrom( this.http.post<any>('https://syspteste.herokuapp.com/api/enterprises', enterprise, { headers: headers }))
  }
}
