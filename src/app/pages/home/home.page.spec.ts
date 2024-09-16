import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';

describe('HomePage', () => {
  let component: HomePage;  // Component instance for the HomePage
  let fixture: ComponentFixture<HomePage>;  // Fixture to handle testing of the component

  // Before each test, initialize the component and trigger change detection
  beforeEach(() => {
    fixture = TestBed.createComponent(HomePage);  // Create an instance of the HomePage component
    component = fixture.componentInstance;  // Get the component instance from the fixture
    fixture.detectChanges();  // Trigger change detection to apply the initial component state
  });

  // Test to verify if the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();  // Check that the component instance is truthy (exists)
  });

  // Another test that checks if the component is created (redundant but descriptive)
  it('should create the home page', () => {
    expect(component).toBeTruthy();  // Check again if the component instance is truthy
  });
  
  // Test to ensure no navigation occurs if the username is empty
  it('should not navigate if username is empty', () => {
    spyOn(component['router'], 'navigate');  // Spy on the 'navigate' method of the router
    component.username = '';  // Set the username to an empty string
    component.startGame();  // Call the method that triggers navigation
    expect(component['router'].navigate).not.toHaveBeenCalled();  // Expect the 'navigate' method not to be called
  });
  
  // Test to check if navigation occurs when a valid username is provided
  it('should navigate to game page if username is valid', () => {
    spyOn(component['router'], 'navigate');  // Spy on the 'navigate' method of the router
    component.username = 'Player';  // Set a valid username
    component.startGame();  // Call the method that triggers navigation
    expect(component['router'].navigate).toHaveBeenCalledWith(
      ['/game'], { queryParams: { username: 'Player' } }
    );  // Expect the router to navigate to the '/game' page with the username as a query parameter
  });
});
