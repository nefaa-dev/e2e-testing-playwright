
@active
Feature: Delete sequences


    Background: Open Vendors App
        Given Vendors Application Is Already Open



    Scenario Outline: User Should be able to delete sequences

        Given User Fill In A Sequence <sequence>
        And   User Click On Add Button
        And   The sequence should be added
        And   Notification Should Be Displayed <message>
        When  User Click On Delete Button
        Then  Sequence Should Be Deleted

        Examples:
            | sequence | message                          |
            | "AGGGT"  | "Sequence(s) added successfully" |

    Scenario Outline: User Should be able to delete sequences

        Given User Fill In A Sequence <sequence>
        And   User Click On Add Button
        And   The sequence should be added
        And   User Keep Only <Vendors> Selected As Vendors
        And   User Click On Validate Button
        And   User Wait For Validating State To Be Completed
        And   User Click On Delete Button
        And   Sequence Should Be Deleted
        When  User Fill In A Sequence <newSequence>
        And   User Click On Add Button
        Then  All Vendors Are Selected By Default
        And   No Results Table Should Be Displayed

        Examples:
            | sequence | message                          | Vendors     | newSequence |
            | "AGGGT"  | "Sequence(s) added successfully" | "Eurofins," | "AGGGG"     |
