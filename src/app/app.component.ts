import { Component, HostListener } from '@angular/core';
import { AuthGuard } from './guards/auth.guard';
import { TestApiService } from '../services/test-api.service';
import { FirebaseService } from './push-notifications/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private authGuard: AuthGuard, private testApiService: TestApiService) {}

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(_event: BeforeUnloadEvent) {
    this.authGuard.logout();
  }

  @HostListener('window:load', ['$event'])
  testApi(){
    this.testApiService.testApi();
    const firebaseService = new FirebaseService();
    firebaseService.initPush();
  }
}
