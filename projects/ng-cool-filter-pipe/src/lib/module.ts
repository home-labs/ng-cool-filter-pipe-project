import { NgModule } from '@angular/core';

import { FilterByPipe } from './pipes/filter-by/pipe';


@NgModule({
    declarations: [
        FilterByPipe
    ],
    imports: [

    ],
    exports: [
        FilterByPipe
    ]
})
export class NgCoolFilterPipeModule { }
