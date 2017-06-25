import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MdButtonModule, MdIconModule, MdSnackBarModule } from '@angular/material';

import { AppComponent } from './app.component';
import { ThreeBitCanvasComponent } from './three-bit-canvas/three-bit-canvas.component';

@NgModule({
  declarations: [
    AppComponent,
    ThreeBitCanvasComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MdButtonModule,
    MdIconModule,
    MdSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
