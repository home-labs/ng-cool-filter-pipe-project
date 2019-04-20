import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { NgFilterCoolModule } from 'ng-filter-cool';


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        NgFilterCoolModule
    ],
    declarations: [
        AppComponent
    ],
    providers: [

    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
