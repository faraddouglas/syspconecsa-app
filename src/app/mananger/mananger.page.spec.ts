import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ManangerPage } from './mananger.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CustomComponent } from '../custom-component/custom-component.component';

describe('ManangerPage', () => {
  let component: ManangerPage;
  let fixture: ComponentFixture<ManangerPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManangerPage ],
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
        CustomComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ManangerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
