//region Imports
import { Component, OnInit } from '@angular/core';
import { OffersServices } from '../services/offers.service';
import { OfferModel } from '../shared/offer.model'
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/distinctUntilChanged'
import 'rxjs/add/operator/catch'
import 'rxjs/add/observable/of'
//endregion Imports

@Component({
  selector: 'pu-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [OffersServices]
})

export class HeaderComponent implements OnInit {

  public offersObservable: Observable<Array<OfferModel>>
  private subjectSearch: Subject<string> = new Subject<string>() //Observador e observado

  constructor(private offersServices: OffersServices) { }

  public search(textSearch: string): void {
    this.subjectSearch.next(textSearch) //Observado
  }

  public clearSearch(): void {
    this.subjectSearch.next('')
  }

  ngOnInit() {
    this.offersObservable = this.subjectSearch
      .debounceTime(1000) //Quantidade de tempo a ser esperado antes de executar a ação do switchMap
      .distinctUntilChanged() //Verifica se a nova consulta contem o mesmo termo da anterior
      .switchMap((textSearch: string) => { //O switchMap vai cancelando eventos anteriores a medida que um novo vai surgindo
        if (textSearch.trim() === '') { //Se o campo estiver em branco
          return Observable.of<Array<OfferModel>>([]) //Retorna um Observable of/de um array de ofertas vazio ([])
        }
        else {
          return this.offersServices.searchOffers(textSearch)
        }
      })
      .catch((error: any) => {
        return Observable.of<Array<OfferModel>>([])
      })
    //Necessário colocar o subscribe para dizer o que fazer após o retorno do switchMap
    //this.offersObservable.subscribe((offers: Array<OfferModel>) => this.offersModel = offers)
  }
}