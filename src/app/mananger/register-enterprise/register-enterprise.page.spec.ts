import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegisterEnterprisePage } from './register-enterprise.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CustomComponent } from 'src/app/custom-component/custom-component.component';

describe('RegisterEnterprisePage', () => {
  let component: RegisterEnterprisePage;
  let fixture: ComponentFixture<RegisterEnterprisePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterEnterprisePage ],
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
        CustomComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterEnterprisePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
