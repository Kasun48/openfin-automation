Feature: Historical Trader Blotter
  As a trader
  I want to view and filter historical trade data
  So that I can analyze past trading activity

  Background:
    Given the OpenFin application is launched
    When I enter valid credentials
    Then I should be logged in successfully
    When I navigate to the Historical Trader Blotter screen
    Then the Historical Trader Blotter screen should be displayed

  @smoke
  Scenario: Basic data display in Historical Trader Blotter
    Then I should see blotter data

  @filtering
  Scenario: Filter blotter by side
    When I filter the side column with "B"
    Then I should see blotter data
    And all rows should have "B" in the side column
    
  @filtering
  Scenario: Filter blotter by ownership
    When I click the "mine" ownership button
    Then I should see blotter data

  @test_case_1
  Scenario: Test Case 1 - Filter by All ownership
    When I click the "all" ownership button
    Then I should see blotter data showing all ownership

  @test_case_2
  Scenario: Test Case 2 - Filter by CORP desk
    When I click the "CORP" desk button
    Then I should see blotter data showing only CORP desk trades

  @test_case_3
  Scenario: Test Case 3 - Filter by Covered status
    When I click the "covered" status button
    Then I should see blotter data showing only Covered status trades

  @test_case_4
  Scenario: Test Case 4 - Filter by USD currency
    When I click the "USD" currency button
    Then I should see blotter data showing only USD currency trades

  @test_case_5
  Scenario: Test Case 5 - Sort by creation time
    When I sort by the "created_time" column
    Then I should see blotter data sorted by creation time

  @test_case_6
  Scenario: Test Case 6 - Filter side column with BUY
    When I filter the side column with "BUY"
    Then I should see blotter data
    And all rows should have "BUY" in the side column