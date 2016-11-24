'use strict';

describe('Component: BookingStayComponent', function() {
  // load the controller's module
  beforeEach(module('triptoliUiApp.booking-stay'));

  var BookingStayComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    BookingStayComponent = $componentController('booking-stay', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
