import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitsSectionComponent } from './visits-section.component';

describe('VisitsSectionComponent', () => {
  let component: VisitsSectionComponent;
  let fixture: ComponentFixture<VisitsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitsSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisitsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
