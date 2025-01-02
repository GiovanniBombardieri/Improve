import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, EMPTY } from 'rxjs'; // Utilizzato per mockare le risposte Observable
import { provideHttpClient } from '@angular/common/http';

import { HomepageComponent } from './homepage.component';
import { AuthService } from '../../auth/auth.service';

import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NewPostDialogComponent } from './new-post-dialog/new-post-dialog.component';

import { Post } from '../../../models/post';
import { Comment } from '../../../models/comment';

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let mockAuthService: Partial<AuthService>;

  // Dati di esempio
  const mockPost: Post[] = [
    {
      id: 1,
      user_id: 1,
      title: 'Test Post',
      body: 'Test Body',
    },
  ];
  const mockComments: Comment[] = [
    {
      id: 1,
      post_id: 1,
      name: 'Test Comment',
      email: 'test@test.com',
      body: 'Test Comment Body',
    },
  ];
  const mockUserData = { token: 'mock-token' };

  beforeEach(async () => {
    // Mock del router
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    mockAuthService = {
      getPostList: jasmine
        .createSpy('getPostList')
        .and.returnValue(of(mockPost)),
      getPostComment: jasmine
        .createSpy('getPostComment')
        .and.returnValue(of(mockComments)),
    };

    // Mock del MatDialog
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    // Mock di localStorage
    spyOn(localStorage, 'getItem').and.returnValue(
      JSON.stringify(mockUserData)
    );

    await TestBed.configureTestingModule({
      declarations: [HomepageComponent, NewPostDialogComponent],
      imports: [
        MatFormFieldModule,
        MatInputModule,
        MatIcon,
        BrowserAnimationsModule,
        MatDividerModule,
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: mockAuthService },
        { provide: MatDialog, useValue: dialogSpy },
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch posts when logged in', () => {
    // Esegui la funzione che carica i post
    component.seePosts();

    // Verifica che i post siano stati popolati
    expect(component.posts.length).toBe(1);
    expect(component.posts).toEqual(mockPost);

    // Verifica che i commenti siano stati popolati
    expect(component.commentsArray[0]).toEqual(mockComments[0]);
  });

  it('should apply filter correctly', () => {
    // Aggiungi un post per il filtro
    component.posts = mockPost;
    const filterValue = 'Test';

    // Simula l'input dell'utente per il filtro
    const event = { target: { value: filterValue } } as unknown as Event;
    component.applyFilter(event);

    // Verifica che il filtro funzioni correttamente
    expect(component.filteredList).toEqual(mockPost);
  });

  it('should open the dialog when openDialog is called', () => {
    // Crea uno spy per l'oggetto restituito da open()
    const dialogRefSpyObj = jasmine.createSpyObj('MatDialogRef', [
      'afterClosed',
    ]);

    // Fai in modo che open() restituisca il mock
    dialogSpy.open.and.returnValue(dialogRefSpyObj);

    // Mock del comportamento di afterClosed()
    dialogRefSpyObj.afterClosed.and.returnValue(of(true)); // Simula la chiusura del dialogo con un valore true

    // Simula l'apertura del dialogo
    component.openDialog();

    // Verifica che il dialogo sia stato aperto
    expect(dialogSpy.open).toHaveBeenCalledWith(NewPostDialogComponent);

    // Verifica che afterClosed() sia stato chiamato
    expect(dialogRefSpyObj.afterClosed).toHaveBeenCalled();
  });

  it('should go to the first page when firstPage is called', () => {
    component.currentPage = 5;
    component.firstPage();
    expect(component.currentPage).toBe(1);
  });

  it('should go to the previous page when previousPage is called', () => {
    component.currentPage = 2;
    component.previousPage();
    expect(component.currentPage).toBe(1);
  });

  it('should go to the next page when nextPage is called', () => {
    component.currentPage = 1;
    component.nextPage();
    expect(component.currentPage).toBe(2);
  });

  it('should go to the last page when lastPage is called', () => {
    component.currentPage = 1;
    component.lastPage();
    expect(component.currentPage).toBe(20);
  });
});
