'use strict';

describe('Component: AccountSettingComponent', function() {
  // load the controller's module
  beforeEach(module('triptoliUiApp.account-setting'));

  var AccountSettingComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    AccountSettingComponent = $componentController('account-setting', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
