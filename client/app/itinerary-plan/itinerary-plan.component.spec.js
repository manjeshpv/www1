'use strict';

describe('Component: ItineraryPlanComponent', function() {
  // load the controller's module
  beforeEach(module('triptoliUiApp.itinerary-plan'));

  var ItineraryPlanComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    ItineraryPlanComponent = $componentController('itinerary-plan', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
