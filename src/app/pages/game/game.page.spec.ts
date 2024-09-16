import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { GamePage } from './game.page';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('GamePage', () => {
  let component: GamePage;
  let fixture: ComponentFixture<GamePage>;
  let routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  let activatedRouteStub = {
    queryParams: of({ username: 'testuser' })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GamePage],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  
    fixture = TestBed.createComponent(GamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the GamePage component', () => {
    expect(component).toBeTruthy();
  });

  it('should set username from queryParams', () => {
    expect(component.username).toBe('testuser');
  });

  it('should navigate to root if username is not provided', async () => {
    TestBed.resetTestingModule();
  
    const activatedRouteStubNoUsername = {
      queryParams: of({})
    };
  
    await TestBed.configureTestingModule({
      declarations: [GamePage],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStubNoUsername }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  
    const fixtureNoUsername = TestBed.createComponent(GamePage);
    const componentNoUsername = fixtureNoUsername.componentInstance;
    fixtureNoUsername.detectChanges();
  
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });
  

  it('should initialize game variables correctly', () => {
    expect(component.points).toBe(0);
    expect(component.selectedLevel).toBe('medium');
    expect(component.gameStarted).toBeFalse();
    expect(component.gameOver).toBeFalse();
    expect(component.cards).toEqual([]);
    expect(component.initGame).toBeTrue();
    expect(component.memorizeCards).toBeFalse();
    expect(component.showTarget).toBeFalse();
    expect(component.cardsEnabled).toBeTrue();
    expect(component.timeRemaining).toBe(0);
    expect(component.gameMessage).toBe('');
  });

  it('should start the memory game with correct settings', fakeAsync(() => {
    spyOn(component, 'generateCards').and.callThrough();
    spyOn(component, 'showCards').and.callThrough();
    spyOn(component, 'startCountdown').and.callThrough();
  
    component.selectedLevel = 'medium';
    component.startMemoryGame();
  
    expect(component.initGame).toBeFalse();
    expect(component.memorizeCards).toBeTrue();
    expect(component.gameStarted).toBeTrue();
    expect(component.gameOver).toBeFalse();
    expect(component.cardsEnabled).toBeTrue();
    expect(component.showTarget).toBeFalse();
    expect(component.gameMessage).toBe('');
    expect(component.generateCards).toHaveBeenCalled();
    expect(component.showCards).toHaveBeenCalled();
  
    tick(5000);
  
    expect(component.hideCards).toBeDefined();
    expect(component.memorizeCards).toBeFalse();
    expect(component.showTarget).toBeTrue();
    expect(component.startCountdown).toHaveBeenCalled();
  
    tick(component.timeRemaining * 1000);
  
    expect(component.timeRemaining).toBe(0);
    expect(component.cardsEnabled).toBeFalse();
    expect(component.gameOver).toBeTrue();
    expect(component.gameMessage).toContain("You didn't press in time");
  }));

  it('should generate cards correctly', () => {
    component.generateCards();
    expect(component.cards.length).toBe(9);
    expect(component.targetNumber).toBeGreaterThanOrEqual(1);
    expect(component.targetNumber).toBeLessThanOrEqual(9);
  });

  it('should hide cards correctly', () => {
    component.generateCards();
    component.hideCards();
    component.cards.forEach(card => {
      expect(card.showValue).toBeFalse();
      expect(card.disabled).toBeFalse();
    });
  });

  it('should update points correctly', () => {
    component.points = 0;
    component.selectedLevel = 'low';
    component.updatePoints();
    expect(component.points).toBe(10);

    component.selectedLevel = 'medium';
    component.updatePoints();
    expect(component.points).toBe(30);

    component.selectedLevel = 'high';
    component.updatePoints();
    expect(component.points).toBe(60);
  });

  it('should handle card selection correctly when correct card is selected', () => {
    component.cardsEnabled = true;
    component.targetNumber = 5;
    component.cards = [
      { value: 5, showValue: false, disabled: false, color: 'light' },
    ];
    const correctCard = component.cards[0];

    component.selectCard(correctCard);

    expect(correctCard.color).toBe('success');
    expect(correctCard.showValue).toBeTrue();
    expect(component.cardsEnabled).toBeFalse();
    expect(component.gameOver).toBeTrue();
    expect(component.gameMessage).toContain('You win');
  });

  it('should handle card selection correctly when incorrect card is selected', () => {
    component.cardsEnabled = true;
    component.targetNumber = 5;
    component.cards = [
      { value: 3, showValue: false, disabled: false, color: 'light' },
    ];
    const incorrectCard = component.cards[0];

    component.selectCard(incorrectCard);

    expect(incorrectCard.color).toBe('danger');
    expect(incorrectCard.showValue).toBeTrue();
    expect(component.cardsEnabled).toBeFalse();
    expect(component.gameOver).toBeTrue();
    expect(component.gameMessage).toContain('You have failed');
  });

  it('should not allow card selection when cards are disabled', () => {
    component.cardsEnabled = false;
    const card = { value: 1, showValue: false, disabled: false, color: 'light' };
    component.selectCard(card);
    expect(card.color).toBe('light');
    expect(card.showValue).toBeFalse();
  });

  it('should start countdown correctly', fakeAsync(() => {
    component.timeRemaining = 3;
    component.startCountdown();
    tick(1000);
    expect(component.timeRemaining).toBe(2);
    tick(1000);
    expect(component.timeRemaining).toBe(1);
    tick(1000);
    expect(component.timeRemaining).toBe(0);
    expect(component.cardsEnabled).toBeFalse();
    expect(component.gameOver).toBeTrue();
    expect(component.gameMessage).toContain("You didn't press in time");
  }));

  it('should shuffle array correctly', () => {
    const array = [1, 2, 3, 4, 5];
    const shuffledArray = component.shuffleArray([...array]);
    expect(shuffledArray.length).toBe(array.length);
    expect(shuffledArray).not.toEqual(array);
  });

  afterEach(() => {
    if (component.timer) {
      clearInterval(component.timer);
    }
  });
});
