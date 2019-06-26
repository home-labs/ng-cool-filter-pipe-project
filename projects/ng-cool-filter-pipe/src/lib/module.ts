import { NgModule } from '@angular/core';

import { FilterByPipe } from './pipes/filter-by/pipe';


@NgModule({
    imports: [

    ],
    declarations: [
        FilterByPipe
    ],
    exports: [
        FilterByPipe
    ]
})
export class NgCoolFilterPipeModule { }
