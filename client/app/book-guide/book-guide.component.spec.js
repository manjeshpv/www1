'use strict';

describe('Component: BookGuideComponent', function() {
  // load the controller's module
  beforeEach(module('triptoliUiApp.book-guide'));

  var BookGuideComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    BookGuideComponent = $componentController('book-guide', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
