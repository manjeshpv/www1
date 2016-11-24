'use strict';

describe('Component: MyTripComponent', function() {
  // load the controller's module
  beforeEach(module('triptoliUiApp.my-trip'));

  var MyTripComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    MyTripComponent = $componentController('my-trip', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
