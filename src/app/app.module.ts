import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { NgCoolFilterPipeModule } from '@actjs.on/ng-cool-filter-pipe';
// import { NgCoolFilterPipeModule } from 'projects/ng-cool-filter-pipe/public-api';


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        NgCoolFilterPipeModule
    ],
    declarations: [
        AppComponent
    ],
    providers: [

    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
