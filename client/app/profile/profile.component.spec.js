'use strict';

describe('Component: ProfileComponent', function() {
  // load the controller's module
  beforeEach(module('triptoliUiApp.profile'));

  var ProfileComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    ProfileComponent = $componentController('profile', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
