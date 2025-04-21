import { Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay, tap } from 'rxjs';
/**
 * Servicio para gestionar la carga y almacenamiento en caché de iconos SVG
 * 
 * Este servicio implementa un patrón singleton a través de Angular DI para centralizar
 * la gestión de iconos en toda la aplicación. Utiliza un sistema de caché para evitar
 * solicitudes HTTP redundantes, mejorando significativamente el rendimiento.
 * 
 * Beneficios implementados:
 * - Optimización de rendimiento mediante caché de solicitudes HTTP
 * - Mejora de accesibilidad al utilizar SVG en lugar de fuentes de iconos
 * - Sanitización automática para prevenir vulnerabilidades XSS
 * - Reducción de código repetitivo en los componentes consumidores
 * 
 * @author [Diego Del Barrio Ayuso] - Proyecto Avoris
 */
@Injectable({
  providedIn: 'root',
})
export class IconRegistryService {
    /**
   * Registro de iconos cargados previamente para evitar solicitudes redundantes
   * Implementa un patrón de memoización para optimizar el rendimiento
   */
  private registry = new Map<string, Observable<SafeHtml>>();

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

 
  /**
   * Carga un icono SVG desde la carpeta de assets y lo almacena en caché.
   * Si el icono ya ha sido solicitado anteriormente, devuelve la versión en caché
   * sin realizar una nueva petición HTTP, optimizando el rendimiento.
   * 
   * La implementación utiliza RxJS para gestionar el flujo asíncrono y
   * garantiza que los SVG sean seguros mediante sanitización.
   * 
   * @param name Nombre del archivo del icono (sin extensión .svg)
   * @param path Ruta relativa a /assets/ donde se almacenan los iconos (por defecto 'icons')
   * @returns Observable con el contenido HTML seguro del SVG
   */
  loadIcon(name: string, path: string = 'icons'): Observable<SafeHtml> {
    const iconUrl = `/assets/${path}/${name}.svg`;

    if (!this.registry.has(name)) {
      const request = this.http.get(iconUrl, { responseType: 'text' }).pipe( 
        map((svg) => {
            // Sanitizamos el SVG para prevenir vulnerabilidades XSS
          // y garantizar la seguridad del contenido inyectado
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
                // Compartimos el resultado entre múltiples suscriptores
        // para evitar solicitudes duplicadas durante la carga inicial
        shareReplay(1)
      );
      this.registry.set(name, request);
    }
    return this.registry.get(name)!;
  }
}
