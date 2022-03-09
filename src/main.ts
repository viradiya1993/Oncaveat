import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
  //navigator.serviceWorker.register('./ngsw-worker.js');
  console.log('1')
}
/* live server work local not work */
 document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic().bootstrapModule(AppModule)
   .catch(err => console.log(err));
});

// platformBrowserDynamic().bootstrapModule(AppModule).then(() => {
//   if ('serviceWorker' in navigator && environment.production) {
//     navigator.serviceWorker.register('./ngsw-worker.js');
//     console.log('2')
//   }
// }).catch(err => console.log(err));

if ('serviceWorker' in navigator || environment.production) {
  navigator.serviceWorker.register('./ngsw-worker.js');
  console.log('2')
}

/* locoal server */

// platformBrowserDynamic().bootstrapModule(AppModule).then(() => {
//   if ('serviceWorker' in navigator && environment.production) {
//     navigator.serviceWorker.register('ngsw-worker.js');
//   }
// }).catch(err => console.log(err));
