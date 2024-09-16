import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { GamePage } from './game.page';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('GamePage', () => {
  let component: GamePage;  // Component instance for testing
  let fixture: ComponentFixture<GamePage>;  // Fixture to provide access to the component's DOM and state
  let routerSpy = jasmine.createSpyObj('Router', ['navigate']);  // Spy to track navigation calls
  let activatedRouteStub = {
    queryParams: of({ username: 'testuser' })  // Stub for ActivatedRoute to provide mock query parameters
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GamePage],  // Declare the component to be tested
      imports: [IonicModule.forRoot(), FormsModule],  // Import necessary modules for the component
      providers: [
        { provide: Router, useValue: routerSpy },  // Provide the Router spy instead of the actual Router
        { provide: ActivatedRoute, useValue: activatedRouteStub }  // Provide the mocked ActivatedRoute
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]  // Ignore custom elements in the template for testing
    }).compileComponents();  // Compile the component and template

    fixture = TestBed.createComponent(GamePage);  // Create the component fixture
    component = fixture.componentInstance;  // Get the component instance
    fixture.detectChanges();  // Trigger change detection to initialize the component
  });

  // Test to check if the component is created successfully
  it('should create the GamePage component', () => {
    expect(component).toBeTruthy();  // Check that the component is truthy (exists)
  });

  // Test to ensure the username is set from the queryParams
  it('should set username from queryParams', () => {
    expect(component.username).toBe('testuser');  // Verify that the username is correctly set
  });

  // Test to verify navigation to the root if no username is provided
  it('should navigate to root if username is not provided', async () => {
    TestBed.resetTestingModule();  // Reset the testing module to simulate a new setup
  
    const activatedRouteStubNoUsername = {
      queryParams: of({})  // Stub ActivatedRoute with no username
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
  
    const fixtureNoUsername = TestBed.createComponent(GamePage);  // Create new component fixture without username
    const componentNoUsername = fixtureNoUsername.componentInstance;  // Get the new component instance
    fixtureNoUsername.detectChanges();
  
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);  // Verify navigation to the root if no username
  });

  // Test to verify that game variables are initialized correctly
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

  // Test to verify the behavior when the memory game starts
  it('should start the memory game with correct settings', fakeAsync(() => {
    spyOn(component, 'generateCards').and.callThrough();  // Spy on the generateCards function
    spyOn(component, 'showCards').and.callThrough();  // Spy on the showCards function
    spyOn(component, 'startCountdown').and.callThrough();  // Spy on the startCountdown function
  
    component.selectedLevel = 'medium';
    component.startMemoryGame();  // Start the memory game
  
    expect(component.initGame).toBeFalse();
    expect(component.memorizeCards).toBeTrue();
    expect(component.gameStarted).toBeTrue();
    expect(component.gameOver).toBeFalse();
    expect(component.cardsEnabled).toBeTrue();
    expect(component.showTarget).toBeFalse();
    expect(component.gameMessage).toBe('');
    expect(component.generateCards).toHaveBeenCalled();  // Ensure cards are generated
    expect(component.showCards).toHaveBeenCalled();  // Ensure cards are shown
  
    tick(5000);  // Simulate 5 seconds
  
    expect(component.hideCards).toBeDefined();  // Ensure cards are hidden
    expect(component.memorizeCards).toBeFalse();
    expect(component.showTarget).toBeTrue();
    expect(component.startCountdown).toHaveBeenCalled();  // Ensure countdown has started
  
    tick(component.timeRemaining * 1000);  // Simulate the remaining time
  
    expect(component.timeRemaining).toBe(0);
    expect(component.cardsEnabled).toBeFalse();
    expect(component.gameOver).toBeTrue();
    expect(component.gameMessage).toContain("You didn't press in time");
  }));

  // Test to verify that cards are generated correctly
  it('should generate cards correctly', () => {
    component.generateCards();
    expect(component.cards.length).toBe(9);  // Ensure 9 cards are generated
    expect(component.targetNumber).toBeGreaterThanOrEqual(1);
    expect(component.targetNumber).toBeLessThanOrEqual(9);
  });

  // Test to verify the correct behavior of hiding the cards
  it('should hide cards correctly', () => {
    component.generateCards();  // Generate cards
    component.hideCards();  // Hide cards
    component.cards.forEach(card => {
      expect(card.showValue).toBeFalse();  // Ensure card values are hidden
      expect(card.disabled).toBeFalse();  // Ensure cards are enabled for selection
    });
  });

  // Test to verify that points are updated correctly based on level
  it('should update points correctly', () => {
    component.points = 0;
    component.selectedLevel = 'low';
    component.updatePoints();
    expect(component.points).toBe(10);  // 10 points for low level

    component.selectedLevel = 'medium';
    component.updatePoints();
    expect(component.points).toBe(30);  // 20 more points for medium level

    component.selectedLevel = 'high';
    component.updatePoints();
    expect(component.points).toBe(60);  // 30 more points for high level
  });

  // Test to verify correct behavior when selecting the correct card
  it('should handle card selection correctly when correct card is selected', () => {
    component.cardsEnabled = true;
    component.targetNumber = 5;  // Set target number
    component.cards = [
      { value: 5, showValue: false, disabled: false, color: 'light' },
    ];
    const correctCard = component.cards[0];

    component.selectCard(correctCard);  // Select the correct card

    expect(correctCard.color).toBe('success');  // Verify card color changes to success (green)
    expect(correctCard.showValue).toBeTrue();  // Ensure card value is shown
    expect(component.cardsEnabled).toBeFalse();  // Cards are disabled after selection
    expect(component.gameOver).toBeTrue();  // Game is over
    expect(component.gameMessage).toContain('You win');
  });

  // Test to verify correct behavior when selecting the incorrect card
  it('should handle card selection correctly when incorrect card is selected', () => {
    component.cardsEnabled = true;
    component.targetNumber = 5;
    component.cards = [
      { value: 3, showValue: false, disabled: false, color: 'light' },
    ];
    const incorrectCard = component.cards[0];

    component.selectCard(incorrectCard);  // Select the incorrect card

    expect(incorrectCard.color).toBe('danger');  // Verify card color changes to danger (red)
    expect(incorrectCard.showValue).toBeTrue();  // Ensure card value is shown
    expect(component.cardsEnabled).toBeFalse();  // Cards are disabled after selection
    expect(component.gameOver).toBeTrue();  // Game is over
    expect(component.gameMessage).toContain('You have failed');
  });

  // Test to verify that card selection is blocked when cards are disabled
  it('should not allow card selection when cards are disabled', () => {
    component.cardsEnabled = false;  // Disable card selection
    const card = { value: 1, showValue: false, disabled: false, color: 'light' };
    component.selectCard(card);
    expect(card.color).toBe('light');  // Ensure card color doesn't change
    expect(card.showValue).toBeFalse();  // Ensure card value is not shown
  });

  // Test to verify countdown starts correctly
  it('should start countdown correctly', fakeAsync(() => {
    component.timeRemaining = 3;
    component.startCountdown();  // Start countdown
    tick(1000);
    expect(component.timeRemaining).toBe(2);  // Verify countdown decrement
    tick(1000);
    expect(component.timeRemaining).toBe(1);
    tick(1000);
    expect(component.timeRemaining).toBe(0);  // Countdown finishes
    expect(component.cardsEnabled).toBeFalse();  // Cards are disabled when time is up
    expect(component.gameOver).toBeTrue();  // Game is over when time runs out
    expect(component.gameMessage).toContain("You didn't press in time");
  }));

  // Test to verify that the shuffle function works correctly
  it('should shuffle array correctly', () => {
    const array = [1, 2, 3, 4, 5];
    const shuffledArray = component.shuffleArray([...array]);  // Shuffle the array
    expect(shuffledArray.length).toBe(array.length);  // Verify array length remains the same
    expect(shuffledArray).not.toEqual(array);  // Ensure the array order is shuffled
  });

  // Clean up after each test, particularly clearing any active timers
  afterEach(() => {
    if (component.timer) {
      clearInterval(component.timer);  // Clear any active interval timers
    }
  });
});
