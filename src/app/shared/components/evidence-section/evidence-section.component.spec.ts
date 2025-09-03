import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvidenceSectionComponent } from './evidence-section.component';

describe('EvidenceSectionComponent', () => {
  let component: EvidenceSectionComponent;
  let fixture: ComponentFixture<EvidenceSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvidenceSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EvidenceSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
