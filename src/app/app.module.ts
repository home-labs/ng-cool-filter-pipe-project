import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { NgCoolFilterModule } from 'ng-cool-filter';


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        NgCoolFilterModule
    ],
    declarations: [
        AppComponent
    ],
    providers: [

    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
