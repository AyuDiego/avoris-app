import { DOCUMENT } from '@angular/common';
import {
  Injectable,
  Renderer2,
  RendererFactory2,
  inject,
  RendererStyleFlags2,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PositionService {
  private renderer: Renderer2;
  private readonly document = inject(DOCUMENT);
  private readonly window = this.document.defaultView;

  constructor() {
    const rendererFactory = inject(RendererFactory2);
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  /**
   * Posiciona un elemento relativo a otro elemento disparador, teniendo en cuenta
   * el offsetParent y ajustando la posición si se sale de la pantalla.
   */
  positionElementRelativeToTrigger(
    triggerElement: HTMLElement,
    targetElement: HTMLElement,
    renderer: Renderer2,
    offset = 4
  ): void {
    if (!triggerElement || !targetElement || !this.window) return;

    const triggerRect = triggerElement.getBoundingClientRect();
    const offsetParent =
      (targetElement.offsetParent as HTMLElement) || this.document.body;
    const parentRect = offsetParent.getBoundingClientRect();

    // Posición inicial calculada (debajo del trigger)
    const initialTop = triggerRect.bottom - parentRect.top + offset;
    const initialLeft = triggerRect.left - parentRect.left;

    // Aplicar estilos iniciales para permitir la medición
    renderer.setStyle(targetElement, 'position', 'absolute');
    renderer.setStyle(targetElement, 'opacity', '0'); 
    renderer.setStyle(targetElement, 'display', 'block');
    renderer.setStyle(targetElement, 'top', `${initialTop}px`);
    renderer.setStyle(targetElement, 'left', `${initialLeft}px`);
    renderer.removeStyle(targetElement, 'transform');
    renderer.setStyle(targetElement, 'z-index', '1050');

    // Usar setTimeout para asegurar que el navegador calcule las dimensiones después de aplicar estilos
    setTimeout(() => {
      if (!this.window) return;

      const targetRect = targetElement.getBoundingClientRect();
      const windowWidth = this.window.innerWidth;
      const windowHeight = this.window.innerHeight;
      const margin = 10;

      let finalTop = initialTop;
      let finalLeft = initialLeft;

      // Ajustar solo en pantallas medianas o más grandes (>= 744px)
      if (windowWidth >= 744) {
        // Comprobación horizontal
        if (targetRect.right > windowWidth - margin) {
          // Se sale por la derecha
          finalLeft = triggerRect.right - parentRect.left - targetRect.width; 
          // Asegurar que no se salga por la izquierda al alinear a la derecha
          if (finalLeft + parentRect.left < margin) {
            finalLeft = margin - parentRect.left;
          }
        } else if (targetRect.left < margin) {
          finalLeft = margin - parentRect.left;
        }

        if (targetRect.bottom > windowHeight - margin) {
          finalTop =
            triggerRect.top - parentRect.top - targetRect.height - offset;
          if (finalTop + parentRect.top < margin) {
            finalTop =
              windowHeight - margin - targetRect.height - parentRect.top;
          }
        }
      }

      if (finalTop !== initialTop) {
        renderer.setStyle(targetElement, 'top', `${finalTop}px`);
      }
      if (finalLeft !== initialLeft) {
        renderer.setStyle(targetElement, 'left', `${finalLeft}px`);
      }

      renderer.setStyle(targetElement, 'opacity', '1');
    }, 0);
  }

  /**
   * Añade un detector de clics fuera del elemento especificado que ejecuta
   * una función cuando se hace clic fuera del elemento y de los elementos excluidos.
   */
  addClickOutsideListener(
    element: HTMLElement,
    renderer: Renderer2,
    callback: () => void,
    excludeElements: HTMLElement[] = []
  ): () => void {
    const handler = (event: MouseEvent) => {
      if (element && !element.contains(event.target as Node)) {
        let clickedOnExcluded = false;
        for (const excludeEl of excludeElements) {
          if (excludeEl && excludeEl.contains(event.target as Node)) {
            clickedOnExcluded = true;
            break;
          }
        }
        if (!clickedOnExcluded) {
          callback();
        }
      }
    };

    return renderer.listen(this.document, 'click', handler);
  }

  /**
   * Restablece los estilos de posición de un elemento HTML.
   */
  resetElementPosition(element: HTMLElement, renderer: Renderer2): void {
    if (!element) return;

    renderer.removeStyle(element, 'position');
    renderer.removeStyle(element, 'top');
    renderer.removeStyle(element, 'left');
    renderer.removeStyle(element, 'width');
    renderer.removeStyle(element, 'height');
    renderer.removeStyle(element, 'transform');
    renderer.removeStyle(element, 'z-index');
  }

  /**
   * Ajusta la posición de un elemento si se detecta que está fuera de los límites de la pantalla.
   */
  private adjustPositionIfOffscreen(
    element: HTMLElement,
    renderer: Renderer2
  ): void {
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Verificar si se sale por el borde derecho
    if (rect.right > windowWidth - 20) {
      const newLeft = Math.max(20, windowWidth - rect.width - 20);
      renderer.setStyle(
        element,
        'left',
        `${newLeft}px`,
        RendererStyleFlags2.Important
      );
    }

    // Verificar si se sale por abajo
    if (rect.bottom > windowHeight - 20) {
      const newTop = Math.max(20, windowHeight - rect.height - 20);
      renderer.setStyle(
        element,
        'top',
        `${newTop}px`,
        RendererStyleFlags2.Important
      );
    }
  }
}
