import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private navCtrl: NavController
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
    this.routToLogin();
  }
}
