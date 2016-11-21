'use strict';

describe('Component: ExploreComponent', function() {
  // load the controller's module
  beforeEach(module('triptoliUiApp.explore'));

  var ExploreComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    ExploreComponent = $componentController('explore', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
