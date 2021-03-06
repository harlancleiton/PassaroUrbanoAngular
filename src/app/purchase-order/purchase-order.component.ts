//region Imports
import { Component, OnInit, ViewChild } from '@angular/core';
import { PurchaseOrderService } from '../services/purchase-order.service';
import { OrderModel } from '../shared/order.model'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { CartItemModel } from '../shared/cart-item.model';
//endregion Imports

//region Components
@Component({
  selector: 'pu-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.css'],
  providers: [PurchaseOrderService]
})
//endregion Components

export class PurchaseOrderComponent implements OnInit {

  //region Variables
  public formGroup: FormGroup = new FormGroup({
    'address': new FormControl(null, [Validators.minLength(5), Validators.maxLength(100), Validators.required]),
    'number': new FormControl(null, [Validators.minLength(1), Validators.maxLength(5), Validators.required]),
    'complement': new FormControl(null),
    'payment': new FormControl(null, [Validators.required])
  })
  public idOrder: number
  public cartItemModel: Array<CartItemModel>
  //endregion Variables

  //region Constructor
  constructor(
    private purchaseOrderService: PurchaseOrderService,
    private shoppingCartService: ShoppingCartService
  ) { }
  //endregion Constructor

  //region Methods
  public makePurchase(): void {
    if (this.formGroup.status === 'INVALID') {
      this.formGroup.get('address').markAsTouched()
      this.formGroup.get('number').markAsTouched()
      this.formGroup.get('complement').markAsTouched()
      this.formGroup.get('payment').markAsTouched()
    } else {
      if (this.shoppingCartService.cartItemModel.length === 0)
        alert('Seu carrinho de compras está vazio. Aproveite nossas ofertas antes de finalizar a compra.')
      else {
        let order: OrderModel = new OrderModel(
          this.formGroup.value.address,
          this.formGroup.value.number, this.formGroup.value.complement,
          this.formGroup.value.payment,
          this.shoppingCartService.cartItemModel
        )
        console.log(order)
        this.purchaseOrderService.makePurchase(order)
          .subscribe((idOrder: number) => {
            this.idOrder = idOrder
            this.shoppingCartService.arrayToClear()
          })
      }
    }
  }
  //endregion Methods

  //region InterfacesMethods
  ngOnInit() {
    this.cartItemModel = this.shoppingCartService.cartItemModel
    //console.log(this.cartItemModel.length)
  }
  //endregion InterfacesMethods
}