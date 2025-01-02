import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        MatToolbarModule,
        MatIconModule,
        BrowserAnimationsModule,
      ],
      declarations: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'improve'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('improve');
  });

  it('should clear localStorage and call reloadPage on logout', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    const clearSpy = spyOn(localStorage, 'clear').and.callThrough();

    const reloadPageSpy = spyOn(app, 'reloadPage').and.callFake(() => {
      console.log('Mock reloadPage called');
    });

    app.logout();

    // Verifichiamo che le funzioni siano state chiamate
    expect(clearSpy).toHaveBeenCalled();
    expect(reloadPageSpy).toHaveBeenCalled();
  });
});
