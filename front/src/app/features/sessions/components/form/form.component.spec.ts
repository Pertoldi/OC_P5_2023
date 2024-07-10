import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../services/session.service';
import { SessionInformation } from '../../../../interfaces/sessionInformation.interface';
import { SessionApiService } from '../../services/session-api.service';

import { FormComponent } from './form.component';
import { Session } from '../../interfaces/session.interface';

describe('FormComponent', () => {

  const sessionInfos: SessionInformation = { username: "", firstName: "", lastName: "", id: 1, admin: true, token: "", type: "" };
  const session: Session = { name: "", description: "", date: new Date(), teacher_id: 1, users: [1] };

  const pathServiceTeacher = 'api/teacher';
  const pathServiceSession = 'api/session';

  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  let sessionService: SessionService;
  let sessionApiService: SessionApiService;
  let controller: HttpTestingController;

  let mockRouter = {
    url: '',
    navigate: jest.fn().mockImplementation(async () => true),
  } as unknown as jest.Mocked<any>;

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: jest.fn().mockReturnValue('1'),
      },
    }
  } as unknown as jest.Mocked<ActivatedRoute>;

  const mockMatSnackBar = {
    open: jest.fn()
  } as unknown as jest.Mocked<MatSnackBar>;



  beforeEach(async () => {

    mockRouter = {
      url: '',
      navigate: jest.fn().mockImplementation(async () => true),
    } as unknown as jest.Mocked<any>;

    await TestBed.configureTestingModule({
      declarations: [FormComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule
      ],
      providers: [
        SessionService,
        SessionApiService,
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;

    sessionService = TestBed.inject(SessionService);
    sessionApiService = TestBed.inject(SessionApiService);
    controller = TestBed.inject(HttpTestingController);

    sessionService.sessionInformation = sessionInfos;

    fixture.detectChanges();
  });

  afterEach(() => {
    controller.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    const teacherReq = controller.expectOne(pathServiceTeacher);
    teacherReq.flush([]);
  });

  it('should init component if user is admin', () => {

    mockRouter.url = 'update';

    component.ngOnInit();

    const teacherReq = controller.expectOne(pathServiceTeacher);
    teacherReq.flush([]);

    const sessionReq = controller.expectOne(`${pathServiceSession}/1`);
    sessionReq.flush({});

    expect(component.onUpdate).toBeTruthy();
    expect(component.sessionForm).toBeDefined();

  });

  it('should create a session', () => {

    const spyCreate = jest.spyOn(sessionApiService, 'create');

    component.onUpdate = false;
    component.submit();

    const teacherReq = controller.expectOne(pathServiceTeacher);
    teacherReq.flush([]);

    const createSessionReq = controller.expectOne(pathServiceSession);
    createSessionReq.flush(session);

    expect(spyCreate).toHaveBeenNthCalledWith(1, component.sessionForm?.value);
  });

  it('should update a session', () => {

    const spyUpdate = jest.spyOn(sessionApiService, 'update');

    // @ts-ignore : private property
    component.id = "1";
    component.onUpdate = true;
    component.submit();

    const teacherReq = controller.expectOne(pathServiceTeacher);
    teacherReq.flush([]);

    const updateSessionReq = controller.expectOne(`${pathServiceSession}/1`);
    updateSessionReq.flush(session);

    expect(spyUpdate).toHaveBeenNthCalledWith(1, "1", component.sessionForm?.value);

  });

});