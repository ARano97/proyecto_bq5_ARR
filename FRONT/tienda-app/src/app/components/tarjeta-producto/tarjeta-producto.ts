import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../models/producto.model';
import { ModalDetalleComponent } from '../modal-detalle/modal-detalle';

@Component({
  selector: 'app-tarjeta-producto',
  standalone: true,
  imports: [CommonModule, ModalDetalleComponent],
  templateUrl: './tarjeta-producto.html',
  styleUrls: ['./tarjeta-producto.css']
})
export class TarjetaProductoComponent {
  @Input() producto!: Producto;
  mostrarModal: boolean = false;

  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }
}