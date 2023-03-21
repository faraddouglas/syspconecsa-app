import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { catchError, Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { CustomComponent } from '../custom-component/custom-component.component';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private navCtrl: NavController,
    private http: HttpClient,
    private customComponent: CustomComponent
    ) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
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

  private redirect(page: string){
    this.navCtrl.navigateForward(page);
  }

  redirectTo(page: string){
    this.redirect(page)
  }

  logout(){
    localStorage.removeItem('user');
    localStorage.removeItem('records');
    localStorage.removeItem('token');
    this.routToLogin();
  }

  async login(companyId: string, userId: string){
    const req: any =  this.http.post(
      `https://syspteste.herokuapp.com/api/login?companyId=${companyId}&userId=${userId}`, {
        responseType: 'json'
      })
      .pipe(
        catchError((err) => {
          if(err.status === 401){
            this.customComponent.presentAlert(
              'Atenção!',
              'Não foi possível realizar o login!',
              'Verifique suas credenciais',
              ['OK']
              );
            this.logout();
          }
          throw new Error('Não foi possível realizar o login');
        }
      ))
      req.subscribe((res: any) => {
      if(res.user.userId == userId){
        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('token', res.token);
          if(res.user.userType === 'admin'){
          this.navCtrl.navigateForward('page/mananger');
        } else {
          this.navCtrl.navigateForward('page/register');
        }
      }
    });
  }
}
