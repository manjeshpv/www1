/**
 * Created by I5 6tg on 12/2/2016.
 */
export class Itinerary {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
    this.message = 'Hello';

  }

  calling(){
    console.log('Testing calling from other');
  }

}
