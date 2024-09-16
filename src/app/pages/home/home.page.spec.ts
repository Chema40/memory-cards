import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create the home page', () => {
    expect(component).toBeTruthy();
  });
  
  it('should not navigate if username is empty', () => {
    spyOn(component['router'], 'navigate');
    component.username = '';
    component.startGame();
    expect(component['router'].navigate).not.toHaveBeenCalled();
  });
  
  it('should navigate to game page if username is valid', () => {
    spyOn(component['router'], 'navigate');
    component.username = 'Player';
    component.startGame();
    expect(component['router'].navigate).toHaveBeenCalledWith(['/game'], { queryParams: { username: 'Player' } });
  });
  
});
