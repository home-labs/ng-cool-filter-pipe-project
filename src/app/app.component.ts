import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

    collection: Object[];

    filterTerm: string;

    constructor() {
        this.collection = [
            {
                name: 'Rafael Pereira Laurindo',
                sexo: 'masculino'
            },
            {
                name: 'Roberto Carlos Gomes Laurindo',
                sexo: 'masculino'
            },
            {
                name: 'Delano Emanoel Bastos',
                sexo: 'masculino'
            },
            {
                name: 'Sandra Suely Candido Bastos',
                sexo: 'feminino'
            },
            {
                name: 'Joelma Candido Bastos Laurindo',
                sexo: 'feminino'
            }
        ];

        this.filterTerm = '';
    }

}
