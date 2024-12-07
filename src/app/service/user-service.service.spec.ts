import { TestBed } from '@angular/core/testing';

import { UserServiceService } from './user-service.service';
import { User } from '../../models/user';

// Il describe raggruppa i test in suite

describe('UserServiceService', () => {
  let service: UserServiceService;

  beforeEach(() => {
    // TestBed configura un modulo specifico per testare un componente o un servizio in modo isolato
    // Puoi dichiarare dipendenze o fornire versioni mock di servizi
    // TestBed.inject viene usato per ottenere un'istanza del servizio da testare

    TestBed.configureTestingModule({ providers: [UserServiceService] });
    service = TestBed.inject(UserServiceService);
  });

  // IT specifica un singolo caso di test

  it('should be created', () => {
    // EXPECT definisce il risultato atteso, in questo caso verifica che il servizio sia creato correttamente

    expect(service).toBeTruthy();
  });

  it('should set and get detailedUser correctly', () => {
    const mockUser: User = {
      id: 1,
      name: 'Test User',
      email: 'example@email.com',
      gender: 'male',
      status: 'active',
    };
    service.setDetailedUser(mockUser);

    const result = service.getDetailedUser();
    expect(result).toEqual(mockUser); // Verifica che l'utente creato di test sia recuperato correttamente
  });
});
