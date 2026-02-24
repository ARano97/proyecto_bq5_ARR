import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductosService } from '../../services/producto.service';
import { TarjetaProductoComponent } from '../../components/tarjeta-producto/tarjeta-producto';
import { Producto } from '../../models/producto.model';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TarjetaProductoComponent
  ],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css']
})
export class InicioComponent {
  // Injectores modernos
  private productosService = inject(ProductosService);
  private route = inject(ActivatedRoute);

  // Signals de estado
  terminoBusqueda = signal<string>('');
  cargando = signal<boolean>(false);
  mensajeError = signal<string>('');
  productos = signal<Producto[]>([]);
  
  // Signal computada
  sinResultados = computed(() => 
    !this.cargando() && this.productos().length === 0 && !this.mensajeError()
  );

  constructor() {
    // Cargar productos al iniciar según la ruta
    this.route.params.subscribe(async (params) => {
      const categoria = params['categoria'];
      await this.cargarProductos(categoria);
    });
  }

  private async cargarProductos(categoria?: string): Promise<void> {
    this.cargando.set(true);
    this.mensajeError.set('');
    
    try {
      let data: Producto[];
      
      if (categoria) {
        // Convertir Observable a Promise con lastValueFrom
        data = await lastValueFrom(this.productosService.getPorCategoria(categoria));
      } else {
        data = await lastValueFrom(this.productosService.getTodos());
      }
      
      this.productos.set(data);
    } catch (err) {
      console.error('Error:', err);
      this.mensajeError.set('Error de conexión con el servidor');
    } finally {
      this.cargando.set(false);
    }
  }

  async buscar(): Promise<void> {
    const termino = this.terminoBusqueda().trim();
    
    if (!termino) {
      // Si el término está vacío, recargar según la categoría actual
      const params = await lastValueFrom(this.route.params);
      await this.cargarProductos(params['categoria']);
      return;
    }

    this.cargando.set(true);
    this.mensajeError.set('');
    
    try {
      const data: Producto[] = await lastValueFrom(this.productosService.buscar(termino));
      this.productos.set(data);
    } catch (err) {
      console.error('Error:', err);
      this.mensajeError.set('Error en la búsqueda');
    } finally {
      this.cargando.set(false);
    }
  }
}