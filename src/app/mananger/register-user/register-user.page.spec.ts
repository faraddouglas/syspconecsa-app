import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegisterUserPage } from './register-user.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CustomComponent } from 'src/app/custom-component/custom-component.component';

describe('RegisterUserPage', () => {
  let component: RegisterUserPage;
  let fixture: ComponentFixture<RegisterUserPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterUserPage ],
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
        CustomComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
