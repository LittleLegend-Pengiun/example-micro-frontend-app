import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { MicrofrontendLoaderModule } from 'microfrontend-loader';
import { EventComponentModule } from 'event-component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MicrofrontendLoaderModule,
    EventComponentModule
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { 
     constructor(private injector: Injector) {
   }

   ngDoBootstrap() {
     const ce = createCustomElement(AppComponent, {injector: this.injector});
     customElements.define('angular-element', ce);
   }
}
