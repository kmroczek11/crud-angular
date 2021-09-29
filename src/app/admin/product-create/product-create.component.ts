import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss'],
})
export class ProductCreateComponent {
  name = '';
  towns = ['Warsaw', 'Cracow', 'Bochnia'];
  bidAmount = 1000;
  status = true;
  town = '';
  radius = 0;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  keywordCtrl = new FormControl();
  filteredKeywords: Observable<string[]>;
  keywords: string[] = [];
  allKeywords = ['modern', 'urgent'];

  @ViewChild('keywordInput')
  keywordInput!: ElementRef<HTMLInputElement>;

  constructor(private productService: ProductService, private router: Router) {
    this.filteredKeywords = this.keywordCtrl.valueChanges.pipe(
      startWith(null),
      map((keyword: string | null) =>
        keyword ? this._filter(keyword) : this.allKeywords.slice()
      )
    );
  }

  submit(): void {
    const data = {
      name: this.name,
      keywords: this.keywords,
      bidAmount: this.bidAmount,
      status: this.status,
      town: this.town,
      radius: this.radius,
    };

    this.productService.create(data).subscribe(() => {
      this.router.navigate(['/admin/products']);
    });
  }

  setTown(town: string): void {
    this.town = town;
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.keywords.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.keywordCtrl.setValue(null);
  }

  remove(keyword: string): void {
    const index = this.keywords.indexOf(keyword);

    if (index >= 0) {
      this.keywords.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.keywords.push(event.option.viewValue);
    this.keywordInput.nativeElement.value = '';
    this.keywordCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allKeywords.filter((keyword) =>
      keyword.toLowerCase().includes(filterValue)
    );
  }
}
