# NgCoolFilter	

## Requirements

>- Angular 4 or higher.

## Installing

	$ npm i ng-cool-filter --save

## Usage

Include the module into `imports` metadata key of `NgModule` decorator in your application context, importing `NgCoolFilterModule` from `ng-cool-filter`, like that.

```typescript
import { NgCoolFilterModule } from 'ng-cool-filter';

@NgModule({
    imports: [
        NgCoolFilterModule
    ]
})
export class MyModule() { }
```

## Usage example with ```*ngFor``` directive

### Component source control

```typescript
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
                name: 'First Name First Last Name',
                gender: 'masculino'
            },
            {
                name: 'Second Name Second Last Name',
                gender: 'masculino'
            },
            {
                name: 'Third Name Third Last Name',
                gender: 'feminino'
            },
            {
                name: 'Fourty Name Fourty Last Name',
                gender: 'masculino'
            },
            {
                name: 'Fifty Name Fifty Last Name',
                gender: 'feminino'
            }
        ];

        this.filterTerm = '';
    }

}
```

### Template

### Template
```html
<input
  type="text"
  [(ngModel)]="filterTerm"
  [ngModelOptions]="{
    standalone: true
  }"
  />

<ul>
  <li *ngFor="let object of collection | filterBy:filterTerm:'name'">
    {{ object.name }}
  </li>
</ul>
```

