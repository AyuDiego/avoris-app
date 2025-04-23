import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
import { IconRegistryService } from './icon-registry.service';
import { catchError, of } from 'rxjs';

describe('IconRegistryService', () => {
  let service: IconRegistryService;
  let httpMock: HttpTestingController;
  let sanitizerSpy: jasmine.SpyObj<DomSanitizer>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('DomSanitizer', ['sanitize', 'bypassSecurityTrustHtml']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        IconRegistryService,
        { provide: DomSanitizer, useValue: spy },
      ],
    });
    service = TestBed.inject(IconRegistryService);
    httpMock = TestBed.inject(HttpTestingController);
    sanitizerSpy = TestBed.inject(DomSanitizer) as jasmine.SpyObj<DomSanitizer>;

    sanitizerSpy.bypassSecurityTrustHtml.and.callFake((value: string) => value as unknown as SafeHtml);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load and sanitize icon SVG content', (done: DoneFn) => {
    const mockSvg = '<svg><path d="M0 0h24v24H0z" fill="none"/></svg>';
    const iconName = 'test-icon';
    const expectedUrl = `/assets/icons/${iconName}.svg`;

    sanitizerSpy.sanitize.and.returnValue(mockSvg);

    service.loadIcon(iconName).subscribe((safeHtml) => {
      expect(safeHtml).toBeTruthy();
      expect(sanitizerSpy.bypassSecurityTrustHtml).toHaveBeenCalledWith(mockSvg);
      done();
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');

    req.flush(mockSvg);
  });

  it('should throw error and log console error if sanitization returns null', (done: DoneFn) => {
    const mockSvg = '<svg><script>alert("bad")</script></svg>';
    const iconName = 'bad-icon';
    const expectedUrl = `/assets/icons/${iconName}.svg`;
    spyOn(console, 'error');

    sanitizerSpy.sanitize.withArgs(SecurityContext.NONE, mockSvg).and.returnValue(null);

    service.loadIcon(iconName)
      .pipe(
        catchError((error: Error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe(`Sanitization failed for icon: ${iconName}`);
          expect(console.error).toHaveBeenCalledWith(
            `Sanitization (NONE) resulted in null/empty for icon: ${iconName}`
          );
          done();
          return of(null);
        })
      )
      .subscribe(result => {
         if (result !== null) {
            fail('Expected service.loadIcon to throw an error, but it completed.');
         }
      });

    const req = httpMock.expectOne(expectedUrl);
    req.flush(mockSvg);
  });

  it('should throw error and log console error if sanitization returns empty string', (done: DoneFn) => {
      const mockSvg = '<svg></svg>';
      const iconName = 'empty-icon';
      const expectedUrl = `/assets/icons/${iconName}.svg`;
      spyOn(console, 'error');

      sanitizerSpy.sanitize.withArgs(SecurityContext.NONE, mockSvg).and.returnValue('');

      service.loadIcon(iconName)
        .pipe(
          catchError((error: Error) => {
            expect(error).toBeTruthy();
            expect(error.message).toBe(`Sanitization failed for icon: ${iconName}`);
            expect(console.error).toHaveBeenCalledWith(
              `Sanitization (NONE) resulted in null/empty for icon: ${iconName}`
            );
            done();
            return of(null);
          })
        )
        .subscribe(result => {
           if (result !== null) {
              fail('Expected service.loadIcon to throw an error, but it completed.');
           }
        });

      const req = httpMock.expectOne(expectedUrl);
      req.flush(mockSvg);
    });
});
