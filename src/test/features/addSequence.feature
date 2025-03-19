@active
Feature: Add sequences


  Background: Open Vendors App
    Given Vendors Application Is Already Open


  @smoke
  Scenario Outline: User Should be able to add sequences

    When User Fill In A Sequence <sequence>
    And  User Click On Add Button
    Then The sequence should be added
    And  Notification Should Be Displayed <message>

    Examples:
      | sequence | message                          |
      | "AGGGT"  | "Sequence(s) added successfully" |
  
  Scenario Outline: User Should not be able to add invalid sequences

    When User Fill In A Sequence <sequence>
    And  User Click On Add Button
    Then The sequence should not be added
    And  Notification Should Be Displayed <message>

    Examples:
      | sequence | message                                                                                      |
      | ""       | "text_input Sequence is too short. Minimum length is 1"                                      |
      | "1A"     | "Please submit a valid DNA/RNA sequence. text_input sequence 3 contains invalid characters." |