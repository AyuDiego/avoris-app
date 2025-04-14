import { Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IconRegistryService {
  private registry = new Map<string, Observable<SafeHtml>>();

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  /**
   * Loads an icon from the assets folder and caches the request.
   * @param name The filename of the icon (without .svg extension)
   * @param path The path relative to /assets/ where icons are stored (defaults to 'icons')
   */
  loadIcon(name: string, path: string = 'icons'): Observable<SafeHtml> {
    const iconUrl = `/assets/${path}/${name}.svg`;

    if (!this.registry.has(name)) {
      const request = this.http.get(iconUrl, { responseType: 'text' }).pipe( 
        map((svg) => {
          const sanitizedSvg = this.sanitizer.sanitize(
            SecurityContext.NONE,
            svg
          );
 

          if (!sanitizedSvg) {
            console.error(
              `Sanitization (NONE) resulted in null/empty for icon: ${name}`
            );
            throw new Error(`Sanitization failed for icon: ${name}`);
          }
          return this.sanitizer.bypassSecurityTrustHtml(sanitizedSvg);
        }),
        shareReplay(1)
      );
      this.registry.set(name, request);
    }
    return this.registry.get(name)!;
  }
}
