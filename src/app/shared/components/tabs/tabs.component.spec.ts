import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TabsComponent } from './tabs.component';
import { IconComponent } from '../icon/icon.component';
import { Tab } from 'src/app/mock-data/tabs.mock';
import { provideHttpClient, withFetch } from '@angular/common/http';

describe('TabsComponent', () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;

  const mockTabs: Tab[] = [
    {
      title: 'Tab 1',
    },
    {
      title: 'Tab 2',
      icon: { name: 'house', style: 'fill: none;' },
    },
    {
      title: 'Tab 3',
      icon: { name: 'mountains', style: 'fill: none;' },
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsComponent],
      providers: [provideHttpClient(withFetch())],
    }).compileComponents();

    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tabs', mockTabs);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render tabs based on input', () => {
    const tabElements = fixture.debugElement.queryAll(By.css('.c-tabs__tab'));
    expect(tabElements.length).toBe(mockTabs.length);
    mockTabs.forEach((tab, index) => {
      const tabLabel = tabElements[index].query(By.css('.c-tabs__label'));
      expect(tabLabel.nativeElement.textContent).toContain(tab.title);
    });
  });

  it('should render icons when provided in tab config', () => {
    const tabElements = fixture.debugElement.queryAll(By.css('.c-tabs__tab'));
    expect(tabElements[0].query(By.css('.c-tabs__icon'))).toBeNull();
    const secondTabIcon = tabElements[1].query(By.css('.c-tabs__icon'));
    expect(secondTabIcon).toBeTruthy();
    const iconComponent = secondTabIcon.query(By.directive(IconComponent));
    expect(iconComponent).toBeTruthy();
    expect(iconComponent.componentInstance.name()).toBe('house');
  });

  it('should have the first tab active by default', () => {
    const tabElements = fixture.debugElement.queryAll(By.css('.c-tabs__tab'));
    expect(
      tabElements[0].nativeElement.classList.contains('c-tabs__tab--active')
    ).toBeTrue();
    expect(
      tabElements[1].nativeElement.classList.contains('c-tabs__tab--active')
    ).toBeFalse();
    expect(tabElements[0].nativeElement.getAttribute('aria-current')).toBe(
      'page'
    );
    expect(
      tabElements[1].nativeElement.getAttribute('aria-current')
    ).toBeNull();
    expect(component.activeIndex()).toBe(0);
  });

  it('should change active tab when clicked', () => {
    const tabElements = fixture.debugElement.queryAll(By.css('.c-tabs__tab'));
    tabElements[1].triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(
      tabElements[0].nativeElement.classList.contains('c-tabs__tab--active')
    ).toBeFalse();
    expect(
      tabElements[1].nativeElement.classList.contains('c-tabs__tab--active')
    ).toBeTrue();
    expect(
      tabElements[0].nativeElement.getAttribute('aria-current')
    ).toBeNull();
    expect(tabElements[1].nativeElement.getAttribute('aria-current')).toBe(
      'page'
    );
    expect(component.activeIndex()).toBe(1);
  });

  it('should call setActive method when tab is clicked', () => {
    spyOn(component, 'setActive').and.callThrough();
    const tabElements = fixture.debugElement.queryAll(By.css('.c-tabs__tab'));
    tabElements[2].triggerEventHandler('click', null);
    expect(component.setActive).toHaveBeenCalledWith(2);
    expect(component.activeIndex()).toBe(2);
  });

  it('should use default tabs when no tabs input is provided', () => {
    const newFixture = TestBed.createComponent(TabsComponent);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();
    try {
      const tabElements = newFixture.debugElement.queryAll(
        By.css('.c-tabs__tab')
      );
      expect(tabElements.length).toBeGreaterThan(0);
      expect(newComponent.tabs()).toBeTruthy();
    } finally {
      newFixture.destroy();
    }
  });

  it('should have appropriate accessibility attributes', () => {
    const nav = fixture.debugElement.query(By.css('.c-tabs'));
    expect(nav.attributes['aria-label']).toBe('Tabs');
    const tabElements = fixture.debugElement.queryAll(By.css('.c-tabs__tab'));
    expect(tabElements[0].attributes['aria-current']).toBe('page');
  });
});
