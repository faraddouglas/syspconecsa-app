import { Component, HostListener} from '@angular/core';
import { AuthGuard } from './guards/auth.guard';

@Component({

  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private authGuard: AuthGuard) {}
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(_event: BeforeUnloadEvent) {
    this.authGuard.logout();
  }
}

