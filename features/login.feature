Feature: User Login

@invalid_login
Scenario: Unsuccessful login with invalid credentials
  Given the OpenFin application is launched
  When I enter invalid credentials
  Then I should see an error message

@valid_login
Scenario: Successful login
  Given the OpenFin application is launched
  When I enter valid credentials
  Then I should be logged in successfully
  When I log out
  Then I should be logged out successfully