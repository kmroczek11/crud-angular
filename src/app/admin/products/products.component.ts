import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'keywords',
    'bidAmount',
    'status',
    'town',
    'radius',
    'action'
  ];
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.all().subscribe((products) => {
      this.products = products;
    });
  }

  productDel(id: number): void {
    this.productService.delete(id).subscribe(() => {
      this.products = this.products.filter((p) => p.id !== id);
    });
  }
}
