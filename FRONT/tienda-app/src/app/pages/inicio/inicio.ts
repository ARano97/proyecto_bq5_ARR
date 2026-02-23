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
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const categoria = params['categoria'];
      if (categoria) {
        this.cargarPorCategoria(categoria);
      } else {
        this.cargarTodos();
      }
    });
  }

  cargarTodos(): void {
    this.cargando = true;
    this.productosService.getTodos().subscribe({
      next: (data) => {
        this.productos = data;
        this.sinResultados = this.productos.length === 0;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.mensajeError = 'Error de conexión con el servidor';
        this.cargando = false;
      }
    });
  }

  cargarPorCategoria(categoria: string): void {
    this.cargando = true;
    this.productosService.getPorCategoria(categoria).subscribe({
      next: (data) => {
        this.productos = data;
        this.sinResultados = this.productos.length === 0;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.mensajeError = 'Error al cargar la categoría';
        this.cargando = false;
      }
    });
  }

  buscar(): void {
    if (!this.terminoBusqueda.trim()) {
      this.cargarTodos();
      return;
    }
    this.cargando = true;
    this.productosService.buscar(this.terminoBusqueda).subscribe({
      next: (data) => {
        this.productos = data;
        this.sinResultados = this.productos.length === 0;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.mensajeError = 'Error en la búsqueda';
        this.cargando = false;
      }
    });
  }
}