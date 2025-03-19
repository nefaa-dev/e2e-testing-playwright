@active
Feature: Upload sequences


    Background: Open Vendors App
        Given Vendors Application Is Already Open


    @smoke
    Scenario Outline: User Should be able to upload sequences

        When User Upload A File <File>
        Then All Sequences In <File> Should Be Added
        And  Notification Should Be Displayed <message>


        Examples:
            | File                                | message                             |
            | "test-data/multipleSequences.fasta" | "Sequence(s) uploaded successfully" |
