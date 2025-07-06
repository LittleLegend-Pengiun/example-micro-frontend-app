import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmbeddedMicrofrontendComponent } from './components/embedded-microfrontend/embedded-microfrontend.component';
import { RemoteLoaderService } from './services/remote-loader.service';

@NgModule({
  imports: [
    CommonModule,
    EmbeddedMicrofrontendComponent
  ],
  providers: [
    RemoteLoaderService
  ],
  exports: [
    EmbeddedMicrofrontendComponent
  ]
})
export class MicrofrontendLoaderModule { }