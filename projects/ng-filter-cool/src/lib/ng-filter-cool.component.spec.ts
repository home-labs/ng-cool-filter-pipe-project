import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgFilterCoolComponent } from './ng-filter-cool.component';

describe('NgFilterCoolComponent', () => {
  let component: NgFilterCoolComponent;
  let fixture: ComponentFixture<NgFilterCoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgFilterCoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgFilterCoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
