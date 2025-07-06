import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventComponent } from './event-component.component';

@NgModule({
  imports: [CommonModule, EventComponent],
  exports: [EventComponent]
})
export class EventComponentModule {} 