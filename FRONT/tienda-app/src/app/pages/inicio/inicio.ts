import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductosService } from '../../services/producto.service';
import { TarjetaProductoComponent } from '../../components/tarjeta-producto/tarjeta-producto';
import { Producto } from '../../models/producto.model';

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
export class InicioComponent implements OnInit {
  productos: Producto[] = [];
  terminoBusqueda: string = '';
  mensajeError: string = '';
  cargando: boolean = false;
  sinResultados: boolean = false;

  constructor(
    private productosService: ProductosService,
    private route: ActivatedRoute
  ) {
    console.log('🔧 InicioComponent constructor llamado');
  }

  ngOnInit(): void {
    console.log('🔧 ngOnInit iniciado');
    
    this.route.params.subscribe(params => {
      console.log('🔧 Parámetros de ruta:', params);
      const categoria = params['categoria'];
      if (categoria) {
        console.log('🔧 Cargando por categoría:', categoria);
        this.cargarPorCategoria(categoria);
      } else {
        console.log('🔧 Cargando todos los productos');
        this.cargarTodos();
      }
    });
  }

  cargarTodos(): void {
    console.log('🔧 cargarTodos() llamado');
    this.cargando = true;
    this.mensajeError = '';
    
    this.productosService.getTodos().subscribe({
      next: (data) => {
        console.log('✅ Datos recibidos correctamente:', data);
        this.productos = data;
        this.sinResultados = this.productos.length === 0;
        this.cargando = false;
      },
      error: (err) => {
        console.error('❌ Error en cargarTodos:', err);
        console.error('❌ Mensaje de error:', err.message);
        console.error('❌ Estado HTTP:', err.status);
        console.error('❌ URL:', err.url);
        
        this.mensajeError = 'Error de conexión con el servidor. Asegúrate de que el backend esté corriendo en http://localhost:3000';
        this.cargando = false;
      }
    });
  }

  cargarPorCategoria(categoria: string): void {
    console.log('🔧 cargarPorCategoria() llamado con:', categoria);
    this.cargando = true;
    this.mensajeError = '';
    
    this.productosService.getPorCategoria(categoria).subscribe({
      next: (data) => {
        console.log('✅ Datos por categoría recibidos:', data);
        this.productos = data;
        this.sinResultados = this.productos.length === 0;
        this.cargando = false;
      },
      error: (err) => {
        console.error('❌ Error en cargarPorCategoria:', err);
        this.mensajeError = 'Error al cargar la categoría';
        this.cargando = false;
      }
    });
  }

  buscar(): void {
    console.log('🔧 buscar() llamado con término:', this.terminoBusqueda);
    
    if (!this.terminoBusqueda.trim()) {
      console.log('🔧 Término vacío, cargando todos');
      this.cargarTodos();
      return;
    }
    
    this.cargando = true;
    this.mensajeError = '';
    
    this.productosService.buscar(this.terminoBusqueda).subscribe({
      next: (data) => {
        console.log('✅ Resultados de búsqueda:', data);
        this.productos = data;
        this.sinResultados = this.productos.length === 0;
        this.cargando = false;
      },
      error: (err) => {
        console.error('❌ Error en búsqueda:', err);
        this.mensajeError = 'Error en la búsqueda';
        this.cargando = false;
      }
    });
  }
}