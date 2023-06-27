import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { AndroidFullScreen } from '@awesome-cordova-plugins/android-full-screen';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.log(err));

AndroidFullScreen.isImmersiveModeSupported()
  .then(() => AndroidFullScreen.immersiveMode())
  .catch(console.warn);
