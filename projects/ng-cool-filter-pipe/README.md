# NgCoolFilterPipe

## Requirements

>- Angular 5 or higher.

## Installing

	$ npm i ng-cool-filter-pipe --save

## Usage

Include the module into `imports` metadata key of `NgModule` decorator in your application context, importing `NgCoolFilterPipeModule` from `ng-cool-filter-pipe`, like that.

```typescript
import { NgCoolFilterPipeModule } from 'ng-cool-filter-pipe';

@NgModule({
    imports: [
        NgCoolFilterPipeModule
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
                gender: 'male'
            },
            {
                name: 'Second Name Second Last Name',
                gender: 'male'
            },
            {
                name: 'Third Name Third Last Name',
                gender: 'famale'
            },
            {
                name: 'Fourty Name Fourty Last Name',
                gender: 'male'
            },
            {
                name: 'Fifty Name Fifty Last Name',
                gender: 'female'
            }
        ];

        this.filterTerm = '';
    }

}
```

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

