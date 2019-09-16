import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})
export class AppComponent {

    objectCollection: object[];

    filterTerm: string;

    constructor() {
        this.objectCollection = [
            {
                name: 'Rafael Pereira Laurindo Bastos',
                gender: 'masculino'
            },
            {
                name: 'Rafael Pereira Rafa',
                gender: 'masculino'
            },
            {
                name: 'Roberto Carlos Gomes Laurindo',
                gender: 'masculino'
            },
            {
                name: 'Delano Emanoel Bastos',
                gender: 'masculino'
            },
            {
                name: 'Sandra Suely Candido Bastos',
                gender: 'feminino'
            },
            {
                name: 'Joelma Candido Bastos Laurindo',
                gender: 'feminino'
            }
        ];

        this.filterTerm = '';
    }

}
