import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { catchError, Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private navCtrl: NavController,
    private http: HttpClient,
    private alertController: AlertController,
    ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkAuth();
  }

  private async checkAuth(){
    const user = localStorage.getItem('user');
    if(!user || user === 'undefined'){
      return false || this.routToLogin();
    }else{
      return true
    }
  }

  private routToLogin(){
    this.navCtrl.navigateRoot('page/login');
    return true;
  }

  logout(){
    localStorage.removeItem('user');
    localStorage.removeItem('records')
    this.routToLogin();
  }

  async login(companyId: string, userId: string){
    const req: any =  this.http.get(
      `https://syspteste.herokuapp.com/api/login?companyId=${companyId}&userId=${userId}`, {
        responseType: 'json'
      })
      .pipe(
        catchError((err) => {
          if(err.status === 401){
            this.presentAlert();
          }
          throw new Error('Não foi possível realizar o login');
        }
      ))
      req.subscribe((res: any) => {
      if(res.userId === userId){
        localStorage.setItem('user', JSON.stringify(res));
        this.navCtrl.navigateForward('page/register');
      }
      });
    }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Atenção!',
      subHeader: 'Não foi possível realizar o login!',
      message: 'Verifique suas credenciais',
      buttons: ['OK'],
    });
    await alert.present();
  }
}
