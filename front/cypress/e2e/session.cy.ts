/// <reference types="cypress" />


describe('Session spec', () => {
  it('Create session successfull', () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/api/teacher',
      },
      [
        {
          id: 1,
          lastName: 'DELAHAYE',
          firstName: 'Margot',
          createdAt: '2023-11-13 17:47:04',
          updatedAt: '2023-11-13 17:47:04',
        },
        {
          id: 2,
          lastName: 'THIERCELIN',
          firstName: 'Hélène',
          createdAt: '2023-10-23 16:43:34',
          updatedAt: '2023-10-23 16:43:34',
        },
      ]
    ).as('teacher');

    cy.intercept('POST', '/api/session', {
      body: [{
        id: 1,
        name: 'Débutant',
        date: '2023-04-01T09:00:00Z',
        teacher_id: 1,
        description: 'Session de découverte',
        users: [3, 4],
        createdAt: '2023-03-20T12:34:56.789Z',
        updatedAt: '2023-03-20T12:34:56.789Z',
      }],
    });

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      [
        {
          id: 1,
          name: 'Débutant',
          date: '2023-04-01T09:00:00Z',
          teacher_id: 1,
          description: 'Session de découverte',
          users: [3, 4],
          createdAt: '2023-03-20T12:34:56.789Z',
          updatedAt: '2023-03-20T12:34:56.789Z',
        },
      ]
    ).as('session');

    // On se connect en tant qu'admin
    cy.visit('/login')
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true
      },
    })
    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
    // Fin de la connection en tant qu'admin

    cy.get('button[routerLink="create"]').click();

    cy.url().should('include', '/sessions/create');

    cy.get('input[formControlName=name]').type('Session de test');
    cy.get('input[formControlName=date]').type('2024-10-10');
    cy.get('mat-select').click();
    cy.get('mat-option').contains('Margot DELAHAYE').click();
    cy.get('textarea[formControlName=description]').type(
      'Description de la session'
    );
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/sessions');
  });

  it('Update session successfull', () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/api/teacher',
      },
      [
        {
          id: 1,
          lastName: 'DELAHAYE',
          firstName: 'Margot',
          createdAt: '2023-11-13 17:47:04',
          updatedAt: '2023-11-13 17:47:04',
        },
        {
          id: 2,
          lastName: 'THIERCELIN',
          firstName: 'Hélène',
          createdAt: '2023-10-23 16:43:34',
          updatedAt: '2023-10-23 16:43:34',
        },
      ]
    ).as('teacher');

    const sessionId = 1;
    cy.intercept(
      {
        method: 'GET',
        url: `/api/session/${sessionId}`,
      },
      {
        id: sessionId,
        name: 'Débutant',
        date: '2023-04-01T09:00:00Z',
        teacher_id: 1,
        description: 'Session de découverte',
        users: [3, 4],
        createdAt: '2023-03-20T12:34:56.789Z',
        updatedAt: '2023-03-20T12:34:56.789Z',
      }
    ).as(`${sessionId}`);

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      [
        {
          id: 1,
          name: 'Débutant',
          date: '2023-04-01T09:00:00Z',
          teacher_id: 1,
          description: 'Session de découverte',
          users: [3, 4],
          createdAt: '2023-03-20T12:34:56.789Z',
          updatedAt: '2023-03-20T12:34:56.789Z',
        },
      ]
    ).as('session');

    // cy.intercept('PUT', '/api/session/1', {});

    cy.intercept('PUT', '/api/session/1', {
      id: 1,
      name: 'Nom de la session',
      date: '2023-04-01T09:00:00Z',
      teacher_id: 1,
      description: 'Session de découverte',
      users: [3, 4],
      createdAt: '2023-03-20T12:34:56.789Z',
      updatedAt: '2023-03-20T12:34:56.789Z',
    });

    cy.get('button.mat-raised-button').contains('Edit').click();
    cy.url().should('include', `/update/${sessionId}`);
    cy.get('input[formControlName=name]').clear().type('Nom de la session');
    cy.get('input[formControlName=date]').clear().type('2023-10-15');
    cy.get('mat-select').click();
    cy.get('mat-option').contains('Margot DELAHAYE').click();
    cy.get('textarea[formControlName=description]')
      .clear()
      .type('Description de la session');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/sessions');
  });

  it('Delete session successfull', () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      [
        {
          id: 1,
          name: 'Débutant',
          date: '2023-04-01T09:00:00Z',
          teacher_id: 1,
          description: 'Session de découverte',
          users: [3, 4],
          createdAt: '2023-03-20T12:34:56.789Z',
          updatedAt: '2023-03-20T12:34:56.789Z',
        },
      ]
    ).as('session');

    cy.intercept('DELETE', '/api/session/1');

    const sessionId = 1;
    const teacherId = 1;
    cy.intercept(
      {
        method: 'GET',
        url: `/api/session/${sessionId}`,
      },
      {
        id: sessionId,
        name: 'Débutant',
        date: '2023-04-01T09:00:00Z',
        teacher_id: 1,
        description: 'Session de découverte',
        users: [3, 4],
        createdAt: '2023-03-20T12:34:56.789Z',
        updatedAt: '2023-03-20T12:34:56.789Z',
      }
    ).as(`${sessionId}`);
    cy.intercept({
      method: 'GET',
      url: `/api/teacher/${teacherId}`,
    },
      {
        id: 1,
        lastName: "DELAHAYE",
        firstName: "Margot",
        createdAt: "2023 - 10 - 23T16: 43: 34",
        updatedAt: "2023 - 10 - 23T16: 43: 34"
      }
    )
    // On se connect en tant qu'admin
    cy.visit('/login')
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true
      },
    })
    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
    // Fin de la connection en tant qu'admin

    cy.get('button.mat-raised-button').contains('Detail').click();

    cy.get('button.mat-raised-button').contains('Delete').click();
    cy.url().should('include', '/sessions');
  });

  it('Show detail account successfull', () => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'Prenom Nom',
        firstName: 'Prenom',
        lastName: 'Nom',
        admin: true,
      },
    });

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []
    ).as('session');

    cy.intercept(
      {
        method: 'GET',
        url: '/api/user/1',
      },
      {
        id: 1,
        name: 'Testtt',
        date: '2000-09-23T00:00:00.000+00:00',
        teacher_id: 1,
        description: 'Test',
        users: [],
        createdAt: '2023-10-10T23:42:42',
        updatedAt: '2023-10-10T23:42:42',
      }
    ).as('1');

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );
    cy.get('span[routerLink="me"].link').click();
  });

  it('Delete user account successfull', () => {
    cy.intercept('DELETE', '/api/user/1', {});
    cy.get('button.mat-raised-button').contains('Detail').click();
    cy.url().should('include', '/');
  });
});

