import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LoginPage2 } from './login.page2';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CustomComponent } from 'src/app/custom-component/custom-component.component';

describe('LoginPage', () => {
  let component: LoginPage2;
  let fixture: ComponentFixture<LoginPage2>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginPage2 ],
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
        CustomComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
