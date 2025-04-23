import { DOCUMENT } from '@angular/common';
import { RendererStyleFlags2 } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PositionService } from './position.service';

describe('PositionService', () => {
  let service: PositionService;
  let document: Document;
  let mockRenderer: any;
  let mockElement: HTMLElement;
  let mockTrigger: HTMLElement;
  let innerWidthSpy: jasmine.Spy;
  let innerHeightSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PositionService],
    });
    service = TestBed.inject(PositionService);
    document = TestBed.inject(DOCUMENT);
    innerWidthSpy = spyOnProperty(window, 'innerWidth', 'get');
    innerHeightSpy = spyOnProperty(window, 'innerHeight', 'get');

    mockElement = document.createElement('div');
    mockTrigger = document.createElement('button');
    document.body.appendChild(mockElement);
    document.body.appendChild(mockTrigger);

    mockRenderer = {
      setStyle: jasmine.createSpy('setStyle'),
      listen: jasmine.createSpy('listen').and.returnValue(() => {}),
      removeStyle: jasmine.createSpy('removeStyle'),
    };

    mockTrigger.getBoundingClientRect = jasmine
      .createSpy('getBoundingClientRect')
      .and.returnValue({
        top: 50,
        left: 50,
        right: 150,
        bottom: 100,
        width: 100,
        height: 50,
        x: 50,
        y: 50,
        toJSON: () => {},
      });

    document.body.getBoundingClientRect = jasmine
      .createSpy('getBoundingClientRect')
      .and.returnValue({
        top: 0,
        left: 0,
        right: 1000,
        bottom: 800,
        width: 1000,
        height: 800,
        x: 0,
        y: 0,
        toJSON: () => {},
      });
  });

  afterEach(() => {
    if (mockElement.parentNode) {
      mockElement.parentNode.removeChild(mockElement);
    }
    if (mockTrigger.parentNode) {
      mockTrigger.parentNode.removeChild(mockTrigger);
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should position element relative to trigger', () => {
    service.positionElementRelativeToTrigger(
      mockTrigger,
      mockElement,
      mockRenderer
    );

    expect(mockRenderer.setStyle).toHaveBeenCalledWith(
      mockElement,
      'position',
      'absolute'
    );
    expect(mockRenderer.setStyle).toHaveBeenCalledWith(
      mockElement,
      'opacity',
      '0'
    );
    expect(mockRenderer.setStyle).toHaveBeenCalledWith(
      mockElement,
      'display',
      'block'
    );
    expect(mockRenderer.setStyle).toHaveBeenCalledWith(
      mockElement,
      'top',
      jasmine.any(String)
    );
    expect(mockRenderer.setStyle).toHaveBeenCalledWith(
      mockElement,
      'left',
      jasmine.any(String)
    );
    expect(mockRenderer.setStyle).toHaveBeenCalledWith(
      mockElement,
      'z-index',
      '1050'
    );
    expect(mockRenderer.removeStyle).toHaveBeenCalledWith(
      mockElement,
      'transform'
    );
  });

  it('should reset element position', () => {
    service.resetElementPosition(mockElement, mockRenderer);

    expect(mockRenderer.removeStyle).toHaveBeenCalledWith(
      mockElement,
      'position'
    );
    expect(mockRenderer.removeStyle).toHaveBeenCalledWith(mockElement, 'top');
    expect(mockRenderer.removeStyle).toHaveBeenCalledWith(mockElement, 'left');
    expect(mockRenderer.removeStyle).toHaveBeenCalledWith(mockElement, 'width');
    expect(mockRenderer.removeStyle).toHaveBeenCalledWith(
      mockElement,
      'height'
    );
    expect(mockRenderer.removeStyle).toHaveBeenCalledWith(
      mockElement,
      'transform'
    );
    expect(mockRenderer.removeStyle).toHaveBeenCalledWith(
      mockElement,
      'z-index'
    );
  });

  it('should handle click outside listeners correctly', () => {
    const callback = jasmine.createSpy('callback');
    let capturedListener: Function = () => {};

    mockRenderer.listen.and.callFake(
      (target: any, event: string, listener: Function) => {
        capturedListener = listener;
        return () => {};
      }
    );

    const cleanup = service.addClickOutsideListener(
      mockElement,
      mockRenderer,
      callback
    );

    expect(mockRenderer.listen).toHaveBeenCalledWith(
      document,
      'click',
      jasmine.any(Function)
    );
    expect(typeof cleanup).toBe('function');

    capturedListener({ target: document.body });
    expect(callback).toHaveBeenCalled();

    callback.calls.reset();
    capturedListener({ target: mockElement });
    expect(callback).not.toHaveBeenCalled();

    const excludedElement = document.createElement('button');
    callback.calls.reset();

    const cleanupWithExcluded = service.addClickOutsideListener(
      mockElement,
      mockRenderer,
      callback,
      [excludedElement]
    );

    capturedListener({ target: excludedElement });
    expect(callback).not.toHaveBeenCalled();
  });

  it('should handle null parameters gracefully', () => {
    service.positionElementRelativeToTrigger(
      null as any,
      mockElement,
      mockRenderer
    );
    expect(mockRenderer.setStyle).not.toHaveBeenCalled();
    mockRenderer.setStyle.calls.reset();

    service.positionElementRelativeToTrigger(
      mockTrigger,
      null as any,
      mockRenderer
    );
    expect(mockRenderer.setStyle).not.toHaveBeenCalled();
    mockRenderer.setStyle.calls.reset();

    service.resetElementPosition(null as any, mockRenderer);
    expect(mockRenderer.removeStyle).not.toHaveBeenCalled();
    mockRenderer.removeStyle.calls.reset();

    (service as any).adjustPositionIfOffscreen(null as any, mockRenderer);
    expect(mockRenderer.setStyle).not.toHaveBeenCalled();
  });

  it('should handle missing window in setTimeout callback', fakeAsync(() => {
    service.positionElementRelativeToTrigger(
      mockTrigger,
      mockElement,
      mockRenderer
    );
    mockRenderer.setStyle.calls.reset();

    (service as any).window = undefined;
    tick(0);

    expect(mockRenderer.setStyle).not.toHaveBeenCalled();
  }));

  it('should handle positioning on small screens', fakeAsync(() => {
    innerWidthSpy.and.returnValue(500);
    innerHeightSpy.and.returnValue(800);

    service.positionElementRelativeToTrigger(
      mockTrigger,
      mockElement,
      mockRenderer
    );

    tick(0);

    expect(mockRenderer.setStyle).toHaveBeenCalledWith(
      mockElement,
      'position',
      'absolute'
    );
    expect(mockRenderer.setStyle).toHaveBeenCalledWith(
      mockElement,
      'opacity',
      '1'
    );
  }));

  it('should handle elements overflowing both right and bottom edges', fakeAsync(() => {
    innerWidthSpy.and.returnValue(800);
    innerHeightSpy.and.returnValue(600);

    document.body.getBoundingClientRect = jasmine
      .createSpy('getBoundingClientRect')
      .and.returnValue({
        top: 30,
        left: 30,
        right: 830,
        bottom: 630,
        width: 800,
        height: 600,
        x: 30,
        y: 30,
        toJSON: () => {},
      });

    mockTrigger.getBoundingClientRect = jasmine
      .createSpy('getBoundingClientRect')
      .and.returnValue({
        top: 550,
        left: 750,
        right: 790,
        bottom: 580,
        width: 40,
        height: 30,
        x: 750,
        y: 550,
        toJSON: () => {},
      });

    mockElement.getBoundingClientRect = jasmine
      .createSpy('getBoundingClientRect')
      .and.callFake(() => {
        return {
          top: 584,
          left: 720,
          right: 1020,
          bottom: 884,
          width: 300,
          height: 300,
          x: 720,
          y: 584,
          toJSON: () => {},
        };
      });

    mockRenderer.setStyle.calls.reset();

    service.positionElementRelativeToTrigger(
      mockTrigger,
      mockElement,
      mockRenderer
    );

    tick(0);

    expect(mockRenderer.setStyle).toHaveBeenCalledWith(
      mockElement,
      'top',
      jasmine.any(String)
    );
    expect(mockRenderer.setStyle).toHaveBeenCalledWith(
      mockElement,
      'left',
      jasmine.any(String)
    );
    expect(mockRenderer.setStyle).toHaveBeenCalledWith(
      mockElement,
      'opacity',
      '1'
    );
  }));
  it('should trigger right overflow and then left edge protection', fakeAsync(() => {
    const margin = 10;
    const testWindowWidth = 800;
    const testWindowHeight = 600;
    const parentLeftOffset = 50;
    const triggerLeft = 740;
    const triggerRight = 790;
    const elementWidth = 800;
    const offset = 4;

    innerWidthSpy.and.returnValue(testWindowWidth);
    innerHeightSpy.and.returnValue(testWindowHeight);

    const parentRect = {
      top: 0,
      left: parentLeftOffset,
      right: testWindowWidth + parentLeftOffset,
      bottom: testWindowHeight,
      width: testWindowWidth,
      height: testWindowHeight,
      x: parentLeftOffset,
      y: 0,
      toJSON: () => {},
    };
    (document.body.getBoundingClientRect as jasmine.Spy).and.returnValue(
      parentRect
    );

    const triggerRect = {
      top: 100,
      left: triggerLeft,
      right: triggerRight,
      bottom: 150,
      width: triggerRight - triggerLeft,
      height: 50,
      x: triggerLeft,
      y: 100,
      toJSON: () => {},
    };
    (mockTrigger.getBoundingClientRect as jasmine.Spy).and.returnValue(
      triggerRect
    );

    let elementCallCount = 0;
    if (!jasmine.isSpy(mockElement.getBoundingClientRect)) {
      spyOn(mockElement, 'getBoundingClientRect');
    }
    (mockElement.getBoundingClientRect as jasmine.Spy).and.callFake(() => {
      elementCallCount++;
      const initialLeftRelativeToParent = triggerLeft - parentLeftOffset;
      const initialTopRelativeToParent =
        triggerRect.bottom - parentRect.top + offset;
      const leftOnScreen = initialLeftRelativeToParent + parentLeftOffset;
      const topOnScreen = initialTopRelativeToParent + parentRect.top;

      return {
        top: topOnScreen,
        left: leftOnScreen,
        right: leftOnScreen + elementWidth,
        bottom: topOnScreen + 100,
        width: elementWidth,
        height: 100,
        x: leftOnScreen,
        y: topOnScreen,
        toJSON: () => {},
      };
    });

    mockRenderer.setStyle.calls.reset();
    elementCallCount = 0;

    service.positionElementRelativeToTrigger(
      mockTrigger,
      mockElement,
      mockRenderer
    );
    tick(0);

    expect(mockRenderer.setStyle).toHaveBeenCalledWith(
      mockElement,
      'left',
      '-40px'
    );
    expect(mockRenderer.setStyle).toHaveBeenCalledWith(
      mockElement,
      'opacity',
      '1'
    );
  }));

  it('should trigger bottom overflow and then top edge protection', fakeAsync(() => {
    const margin = 10;
    const offset = 4;
    const testWindowWidth = 800;
    const testWindowHeight = 600;
    const parentTopOffset = 50;
    const elementHeight = 500;
    const elementWidth = 200;

    innerWidthSpy.and.returnValue(testWindowWidth);
    innerHeightSpy.and.returnValue(testWindowHeight);

    const parentRect = {
      top: parentTopOffset,
      left: 0,
      right: testWindowWidth,
      bottom: testWindowHeight + parentTopOffset,
      width: testWindowWidth,
      height: testWindowHeight,
      x: 0,
      y: parentTopOffset,
      toJSON: () => {},
    };
    (document.body.getBoundingClientRect as jasmine.Spy).and.returnValue(
      parentRect
    );

    const triggerRect = {
      top: 100,
      left: 100,
      right: 200,
      bottom: 150,
      width: 100,
      height: 50,
      x: 100,
      y: 100,
      toJSON: () => {},
    };
    (mockTrigger.getBoundingClientRect as jasmine.Spy).and.returnValue(
      triggerRect
    );

    let elementCallCount = 0;
    if (!jasmine.isSpy(mockElement.getBoundingClientRect)) {
      spyOn(mockElement, 'getBoundingClientRect');
    }
    (mockElement.getBoundingClientRect as jasmine.Spy).and.callFake(() => {
      elementCallCount++;
      const initialTopRelativeToParent =
        triggerRect.bottom - parentRect.top + offset;
      const initialLeftRelativeToParent = triggerRect.left - parentRect.left;
      const topOnScreen = initialTopRelativeToParent + parentRect.top;
      const leftOnScreen = initialLeftRelativeToParent + parentRect.left;

      return {
        top: topOnScreen,
        left: leftOnScreen,
        right: leftOnScreen + elementWidth,
        bottom: topOnScreen + elementHeight,
        width: elementWidth,
        height: elementHeight,
        x: leftOnScreen,
        y: topOnScreen,
        toJSON: () => {},
      };
    });

    mockRenderer.setStyle.calls.reset();
    elementCallCount = 0;

    service.positionElementRelativeToTrigger(
      mockTrigger,
      mockElement,
      mockRenderer
    );
    tick(0);

    expect(mockRenderer.setStyle).toHaveBeenCalledWith(
      mockElement,
      'top',
      '40px'
    );
    expect(mockRenderer.setStyle).toHaveBeenCalledWith(
      mockElement,
      'opacity',
      '1'
    );
  }));
  describe('adjustPositionIfOffscreen', () => {
    const margin = 20;

    beforeEach(() => {
      mockRenderer.setStyle.calls.reset();
      spyOn(mockElement, 'getBoundingClientRect');
    });

    it('should adjust position when element overflows right edge', () => {
      const windowWidth = 800;
      const elementWidth = 100;
      innerWidthSpy.and.returnValue(windowWidth);
      innerHeightSpy.and.returnValue(600);

      (mockElement.getBoundingClientRect as jasmine.Spy).and.returnValue({
        right: windowWidth - margin + 10,
        width: elementWidth,
        left: windowWidth - margin + 10 - elementWidth,
        top: 100,
        bottom: 200,
        height: 100,
        x: windowWidth - margin + 10 - elementWidth,
        y: 100,
        toJSON: () => {},
      });

      const expectedLeft = Math.max(
        margin,
        windowWidth - elementWidth - margin
      );

      service['adjustPositionIfOffscreen'](mockElement, mockRenderer);

      expect(mockRenderer.setStyle).toHaveBeenCalledWith(
        mockElement,
        'left',
        `${expectedLeft}px`,
        RendererStyleFlags2.Important
      );
    });

    it('should adjust position when element overflows bottom edge', () => {
      const windowHeight = 600;
      const elementHeight = 100;
      innerWidthSpy.and.returnValue(800);
      innerHeightSpy.and.returnValue(windowHeight);

      (mockElement.getBoundingClientRect as jasmine.Spy).and.returnValue({
        bottom: windowHeight - margin + 10,
        height: elementHeight,
        right: 200,
        width: 100,
        left: 100,
        top: windowHeight - margin + 10 - elementHeight,
        x: 100,
        y: windowHeight - margin + 10 - elementHeight,
        toJSON: () => {},
      });

      const expectedTop = Math.max(
        margin,
        windowHeight - elementHeight - margin
      );

      service['adjustPositionIfOffscreen'](mockElement, mockRenderer);

      expect(mockRenderer.setStyle).toHaveBeenCalledWith(
        mockElement,
        'top',
        `${expectedTop}px`,
        RendererStyleFlags2.Important
      );
    });

    it('should not adjust position when element is within bounds', () => {
      const windowWidth = 800;
      const windowHeight = 600;
      innerWidthSpy.and.returnValue(windowWidth);
      innerHeightSpy.and.returnValue(windowHeight);

      (mockElement.getBoundingClientRect as jasmine.Spy).and.returnValue({
        right: windowWidth - margin - 10,
        bottom: windowHeight - margin - 10,
        width: 100,
        height: 100,
        left: 670,
        top: 470,
        x: 670,
        y: 470,
        toJSON: () => {},
      });

      service['adjustPositionIfOffscreen'](mockElement, mockRenderer);

      expect(mockRenderer.setStyle).not.toHaveBeenCalled();
    });
  });
});
