@active
Feature: Validate Sequences


    Background: Open Vendors App
        Given Vendors Application Is Already Open


    @smoke
    Scenario Outline: User Should be able to validate sequences

        Given User Upload A File <File>
        And   All Sequences In <File> Should Be Added
        And   All Vendors Are Selected By Default
        And   Low Scoring Matrix Status Should Be <Default_Status_Low_Scoring>
        When  User Keep Only <Vendors> Selected As Vendors
        And   User Set <Construct_Types> For <Vendors> If Applicable
        And   User Set <Low_Scoring_Matrix> If Applicable
        And   User Click On Validate Button
        And   User Wait For Validating State To Be Completed
        Then  User Should Get The Validation Results Table For All Sequences
        And   Results Should Be As <ExpectedResults> For The Selected <Vendors>

        Examples:
            | File                                                               | Vendors                                          | Construct_Types                            | ExpectedResults                                                        | Low_Scoring_Matrix | Default_Status_Low_Scoring |
            | "test-data/seq_len_500_gc_25.fasta"                                | "Eurofins,Twistdna,ThermoFisher,Biontech"        | "na,non_cloned_gene,na,non_cloned_gene"    | "vendors-results/seq_len_500_gc_25.csv"                                | "true"             | "false"                    |
            | "test-data/seq_len_500_gc_25_Homopolymer_20.fasta"                 | "Eurofins,Twistdna,ThermoFisher,Biontech"        | "na,non_cloned_gene,na,non_cloned_gene"    | "vendors-results/seq_len_500_gc_25_Homopolymer_20.csv"                 | "true"             | "false"                    |
            | "test-data/seq_len_500_gc_25_Homopolymer_10.fasta"                 | "Eurofins,Twistdna,ThermoFisher,Biontech"        | "na,non_cloned_gene,na,non_cloned_gene"    | "vendors-results/seq_len_500_gc_25_Homopolymer_10.csv"                 | "true"             | "false"                    |
            | "test-data/seq_len_500_gc_25_Homopolymer_10_inverted-repeat.fasta" | "Eurofins,Twistdna,ThermoFisher,Biontech"        | "na,non_cloned_gene,na,non_cloned_gene"    | "vendors-results/seq_len_500_gc_25_Homopolymer_10_inverted-repeat.csv" | "true"             | "false"                    |
            | "test-data/seq_len_750_gc_25_Homopolymer_10.fasta"                 | "Eurofins,IDTDNA,Twistdna,ThermoFisher,Biontech" | "na,na,non_cloned_gene,na,non_cloned_gene" | "vendors-results/seq_len_750_gc_25_Homopolymer_10.csv"                 | "true"             | "false"                    |
            | "test-data/seq_len_750_gc_25.fasta"                                | "Eurofins,IDTDNA,Twistdna,ThermoFisher,Biontech" | "na,na,non_cloned_gene,na,non_cloned_gene" | "vendors-results/seq_len_750_gc_25.csv"                                | "true"             | "false"                    |
            | "test-data/seq_len_750_gc_45.fasta"                                | "Eurofins,IDTDNA,Twistdna,ThermoFisher,Biontech" | "na,na,non_cloned_gene,na,non_cloned_gene" | "vendors-results/seq_len_750_gc_45.csv"                                | "true"             | "false"                    |
            | "test-data/seq_len_750_gc_25_Homopolymer_10_inverted-repeat.fasta" | "Eurofins,IDTDNA,Twistdna,ThermoFisher,Biontech" | "na,na,non_cloned_gene,na,non_cloned_gene" | "vendors-results/seq_len_750_gc_25_Homopolymer_10_inverted-repeat.csv" | "true"             | "false"                    |
            | "test-data/seq_len_750_gc_25_Homopolymer_20.fasta"                 | "Eurofins,IDTDNA,Twistdna,ThermoFisher,Biontech" | "na,na,non_cloned_gene,na,non_cloned_gene" | "vendors-results/seq_len_750_gc_25_Homopolymer_20.csv"                 | "true"             | "false"                    |
            | "test-data/seq_len_1500_gc_45_Homopolymer_10.fasta"                | "Eurofins,IDTDNA,Twistdna,ThermoFisher,Biontech" | "na,na,non_cloned_gene,na,non_cloned_gene" | "vendors-results/seq_len_1500_gc_45_Homopolymer_10.csv"                | "true"             | "false"                    |


    Scenario Outline: Upload Sequences with specific length

        Given User Upload A File <File>
        And   All Sequences In <File> Should Be Added
        And   All Vendors Are Selected By Default
        When  User Keep Only <Vendors> Selected As Vendors
        And   User Set <Construct_Types> For <Vendors> If Applicable
        And   User Set <Low_Scoring_Matrix> If Applicable
        And   User Click On Validate Button
        And   User Wait For Validating State To Be Completed
        Then  User Should Get The Validation Results Table For All Sequences
        And   Results Should Be As <ExpectedResults> For The Selected <Vendors>

        Examples:
            | File                                           | Vendors             | Construct_Types                   | ExpectedResults                                    | Low_Scoring_Matrix |
            | "test-data/length-val/sequence_len_24.fasta"   | "IDTDNA"            | "na"                              | "vendors-results/length-val/sequence_len_24.csv"   | ""                 |
            | "test-data/length-val/sequence_len_27.fasta"   | "IDTDNA"            | "na"                              | "vendors-results/length-val/sequence_len_27.csv"   | ""                 |
            | "test-data/length-val/sequence_len_199.fasta"  | "ThermoFisher"      | "na"                              | "vendors-results/length-val/sequence_len_199.csv"  | ""                 |
            | "test-data/length-val/sequence_len_200.fasta"  | "ThermoFisher"      | "na"                              | "vendors-results/length-val/sequence_len_200.csv"  | ""                 |
            | "test-data/length-val/sequence_len_299.fasta"  | "BioNTech"          | "non_cloned_gene"                 | "vendors-results/length-val/sequence_len_299.csv"  | ""                 |
            | "test-data/length-val/sequence_len_300.fasta"  | "BioNTech"          | "non_cloned_gene"                 | "vendors-results/length-val/sequence_len_300.csv"  | ""                 |
            | "test-data/length-val/sequence_len_3000.fasta" | "ThermoFisher"      | "na"                              | "vendors-results/length-val/sequence_len_3000.csv" | ""                 |
            | "test-data/length-val/sequence_len_3001.fasta" | "ThermoFisher"      | "na"                              | "vendors-results/length-val/sequence_len_3001.csv" | ""                 |
            | "test-data/length-val/sequence_len_5000.fasta" | "TwistDNA,BioNTech" | "non_cloned_gene,non_cloned_gene" | "vendors-results/length-val/sequence_len_5000.csv" | "true"             |
            | "test-data/length-val/sequence_len_5001.fasta" | "TwistDNA,BioNTech" | "non_cloned_gene,non_cloned_gene" | "vendors-results/length-val/sequence_len_5001.csv" | "true"             |



    Scenario Outline: Validate More Sequences

        Given User Upload A File <File>
        And   All Sequences In <File> Should Be Added
        And   All Vendors Are Selected By Default
        When  User Keep Only <Vendors> Selected As Vendors
        And   User Set <Construct_Types> For <Vendors> If Applicable
        And   User Set <Low_Scoring_Matrix> If Applicable
        And   User Click On Validate Button
        And   User Wait For Validating State To Be Completed
        Then  User Should Get The Validation Results Table For All Sequences
        And   Results Should Be As <ExpectedResults> For The Selected <Vendors>

        Examples:
            | File                                                                | Vendors                                          | Construct_Types                            | ExpectedResults                                                         | Low_Scoring_Matrix |
            | "test-data/seq_len_750_gc_65.fasta"                                 | "Eurofins,IDTDNA,Twistdna,ThermoFisher,Biontech" | "na,na,non_cloned_gene,na,non_cloned_gene" | "vendors-results/seq_len_750_gc_65.csv"                                 | "true"             |
            | "test-data/seq_len_750_gc_65_Homopolymer_10.fasta"                  | "Eurofins,IDTDNA,Twistdna,ThermoFisher,Biontech" | "na,na,non_cloned_gene,na,non_cloned_gene" | "vendors-results/seq_len_750_gc_65_Homopolymer_10.csv"                  | "true"             |
            | "test-data/seq_len_750_gc_65_Homopolymer_10_inverted-repeat.fasta"  | "Eurofins,IDTDNA,Twistdna,ThermoFisher,Biontech" | "na,na,non_cloned_gene,na,non_cloned_gene" | "vendors-results/seq_len_750_gc_65_Homopolymer_10_inverted-repeat.csv"  | "true"             |
            | "test-data/seq_len_750_gc_65_Homopolymer_20.fasta"                  | "Eurofins,IDTDNA,Twistdna,ThermoFisher,Biontech" | "na,na,non_cloned_gene,na,non_cloned_gene" | "vendors-results/seq_len_750_gc_65_Homopolymer_20.csv"                  | "true"             |
            | "test-data/seq_len_750_gc_65_Homopolymer_20_inverted-repeat.fasta"  | "Eurofins,IDTDNA,Twistdna,ThermoFisher,Biontech" | "na,na,non_cloned_gene,na,non_cloned_gene" | "vendors-results/seq_len_750_gc_65_Homopolymer_20_inverted-repeat.csv"  | "true"             |
            | "test-data/seq_len_750_gc_65_inverted-repeat.fasta"                 | "Eurofins,IDTDNA,Twistdna,ThermoFisher,Biontech" | "na,na,non_cloned_gene,na,non_cloned_gene" | "vendors-results/seq_len_750_gc_65_inverted-repeat.csv"                 | "true"             |
            | "test-data/seq_len_1500_gc_45.fasta"                                | "Eurofins,IDTDNA,Twistdna,ThermoFisher,Biontech" | "na,na,non_cloned_gene,na,non_cloned_gene" | "vendors-results/seq_len_1500_gc_45.csv"                                | "true"             |
            | "test-data/seq_len_1500_gc_45_Homopolymer_20_inverted-repeat.fasta" | "Eurofins,IDTDNA,Twistdna,ThermoFisher,Biontech" | "na,na,non_cloned_gene,na,non_cloned_gene" | "vendors-results/seq_len_1500_gc_45_Homopolymer_20_inverted-repeat.csv" | "true"             |
            | "test-data/seq_len_1500_gc_45_Homopolymer_20.fasta"                 | "Eurofins,IDTDNA,Twistdna,ThermoFisher,Biontech" | "na,na,non_cloned_gene,na,non_cloned_gene" | "vendors-results/seq_len_1500_gc_45_Homopolymer_20.csv"                 | "true"             |
            | "test-data/seq_len_1500_gc_45_inverted-repeat.fasta"                | "Eurofins,IDTDNA,Twistdna,ThermoFisher,Biontech" | "na,na,non_cloned_gene,na,non_cloned_gene" | "vendors-results/seq_len_1500_gc_45_inverted-repeat.csv"                | "true"             |
            | "test-data/seq_len_1500_gc_45_Homopolymer_10_inverted-repeat.fasta" | "Eurofins,IDTDNA,Twistdna,ThermoFisher,Biontech" | "na,na,non_cloned_gene,na,non_cloned_gene" | "vendors-results/seq_len_1500_gc_45_Homopolymer_10_inverted-repeat.csv" | "true"             |




    Scenario Outline: Validate Sequences Using Cloned Gene As Construct Type

        Given User Upload A File <File>
        And   All Sequences In <File> Should Be Added
        And   All Vendors Are Selected By Default
        When  User Keep Only <Vendors> Selected As Vendors
        And   User Set <Construct_Types> For <Vendors> If Applicable
        And   User Set <Vectors> And <Insertions> For <Vendors> When Applicable
        And   User Set <Low_Scoring_Matrix> If Applicable
        And   User Click On Validate Button
        And   User Wait For Validating State To Be Completed
        Then  User Should Get The Validation Results Table For All Sequences
        And   Results Should Be As <ExpectedResults> For The Selected <Vendors>

        Examples:
            | File                                                                | Vendors             | Construct_Types           | ExpectedResults                                                                                          | Low_Scoring_Matrix | Vectors                    | Insertions                                 |
            | "test-data/seq_len_750_gc_35.fasta"                                 | "Twistdna,Biontech" | "cloned_gene,cloned_gene" | "vendors-results/vectors/seq_len_750_gc_35-pTwist_Amp.csv"                                               | "true"             | "pTwist Amp High Copy"     | "pTwist Amp"                               |
            | "test-data/seq_len_1000_gc_25_Homopolymer_10_inverted-repeat.fasta" | "Twistdna,Biontech" | "cloned_gene,cloned_gene" | "vendors-results/vectors/seq_len_1000_gc_25_Homopolymer_10_inverted-repeat-pTwist_Chlor.csv"             | "true"             | "pTwist Chlor High Copy"   | "pTwist Chlor"                             |
            | "test-data/seq_len_1000_gc_25_Homopolymer_10.fasta"                 | "Twistdna,Biontech" | "cloned_gene,cloned_gene" | "vendors-results/vectors/seq_len_1000_gc_25_Homopolymer_10-pTwist_Amp_MC.csv"                            | "true"             | "pTwist Amp Medium Copy"   | "pTwist Amp MC"                            |
            | "test-data/seq_len_1000_gc_25_Homopolymer_20_inverted-repeat.fasta" | "Twistdna,Biontech" | "cloned_gene,cloned_gene" | "vendors-results/vectors/seq_len_1000_gc_25_Homopolymer_20_inverted-repeat-pTwist_Chlor_MC.csv"          | "true"             | "pTwist Chlor Medium Copy" | "pTwist Chlor MC"                          |
            | "test-data/seq_len_1000_gc_25_Homopolymer_20.fasta"                 | "Twistdna,Biontech" | "cloned_gene,cloned_gene" | "vendors-results/vectors/seq_len_1000_gc_25_Homopolymer_20-pTwist_Kan_MC.csv"                            | "true"             | "pTwist Kan Medium Copy"   | "pTwist Kan MC"                            |
            | "test-data/seq_len_1000_gc_25_inverted-repeat.fasta"                | "Twistdna,Biontech" | "cloned_gene,cloned_gene" | "vendors-results/vectors/seq_len_1000_gc_25_inverted-repeat-NdeI_XhoI.csv"                               | "true"             | "pET-29b(+)"               | "NdeI_XhoI"                                |
            | "test-data/seq_len_1000_gc_25_inverted-repeat.fasta"                | "Twistdna,Biontech" | "cloned_gene,cloned_gene" | "vendors-results/vectors/seq_len_1000_gc_25_inverted-repeat-BamHI_XhoI.csv"                              | "true"             | "pET-29b(+)"               | "BamHI_XhoI"                               |
            | "test-data/seq_len_1000_gc_25_inverted-repeat.fasta"                | "Twistdna,Biontech" | "cloned_gene,cloned_gene" | "vendors-results/vectors/seq_len_1000_gc_25_inverted-repeat-SacI_HindIII.csv"                            | "true"             | "pET-29b(+)"               | "SacI_HindIII"                             |
            | "test-data/seq_len_1000_gc_25_inverted-repeat.fasta"                | "Twistdna,Biontech" | "cloned_gene,cloned_gene" | "vendors-results/vectors/seq_len_1000_gc_25_inverted-repeat-BamHI_HindIII.csv"                           | "true"             | "pET-29b(+)"               | "BamHI_HindIII"                            |
            | "test-data/seq_len_1000_gc_25_inverted-repeat.fasta"                | "Twistdna,Biontech" | "cloned_gene,cloned_gene" | "vendors-results/vectors/seq_len_1000_gc_25_inverted-repeat-EcoRI_NotI.csv"                              | "true"             | "pET-29b(+)"               | "EcoRI_NotI"                               |
            | "test-data/seq_len_1000_gc_25.fasta"                                | "Twistdna,Biontech" | "cloned_gene,cloned_gene" | "vendors-results/vectors/seq_len_1000_gc_25-BglII_XhoI.csv"                                              | "true"             | "pET-24(+)"                | "BglII_XhoI"                               |
            | "test-data/seq_len_1000_gc_35_Homopolymer_10_inverted-repeat.fasta" | "Twistdna,Biontech" | "cloned_gene,cloned_gene" | "vendors-results/vectors/seq_len_1000_gc_35_Homopolymer_10_inverted-repeat-EcoRI_NheI.csv"               | "true"             | "pTwist CMV Hygro"         | "EcoRI_NheI"                               |
            | "test-data/seq_len_1000_gc_35_Homopolymer_10_inverted-repeat.fasta" | "Twistdna,Biontech" | "cloned_gene,cloned_gene" | "vendors-results/vectors/seq_len_1000_gc_35_Homopolymer_10_inverted-repeat-EcoRI_BamHI.csv"              | "true"             | "pTwist CMV Hygro"         | "EcoRI_BamHI"                              |
            | "test-data/seq_len_1000_gc_35_Homopolymer_10_inverted-repeat.fasta" | "Twistdna,Biontech" | "cloned_gene,cloned_gene" | "vendors-results/vectors/seq_len_1000_gc_35_Homopolymer_10_inverted-repeat-NotI_XbaI.csv"                | "true"             | "pTwist CMV Hygro"         | "NotI_XbaI"                                |
            | "test-data/seq_len_1000_gc_35_Homopolymer_10_inverted-repeat.fasta" | "Twistdna,Biontech" | "cloned_gene,cloned_gene" | "vendors-results/vectors/seq_len_1000_gc_35_Homopolymer_10_inverted-repeat-NotI_NheI.csv"                | "true"             | "pTwist CMV Hygro"         | "NotI_NheI"                                |
            | "test-data/seq_len_1000_gc_35_Homopolymer_10_inverted-repeat.fasta" | "Twistdna,Biontech" | "cloned_gene,cloned_gene" | "vendors-results/vectors/seq_len_1000_gc_35_Homopolymer_10_inverted-repeat-HIndIII_NheI.csv"             | "true"             | "pTwist CMV Hygro"         | "HIndIII_NheI"                             |
            | "test-data/seq_len_1000_gc_35_Homopolymer_10_inverted-repeat.fasta" | "Twistdna,Biontech" | "cloned_gene,cloned_gene" | "vendors-results/vectors/seq_len_1000_gc_35_Homopolymer_10_inverted-repeat-NotI_BamHI.csv"               | "true"             | "pTwist CMV Hygro"         | "NotI_BamHI"                               |
            | "test-data/seq_len_1000_gc_35_Homopolymer_10_inverted-repeat.fasta" | "Twistdna,Biontech" | "cloned_gene,cloned_gene" | "vendors-results/vectors/seq_len_1000_gc_35_Homopolymer_10_inverted-repeat-HindIII_BamHI.csv"            | "true"             | "pTwist CMV Hygro"         | "HindIII_BamHI"                            |
            | "test-data/seq_len_1000_gc_35_Homopolymer_10.fasta"                 | "Twistdna,Biontech" | "cloned_gene,cloned_gene" | "vendors-results/vectors/seq_len_1000_gc_35_Homopolymer_10-VHHFc_TAG.csv"                                | "true"             | "pTwist CMV hIgG1-Fc"      | "VHHFc_TAG"                                |
            | "test-data/seq_len_1000_gc_35_Homopolymer_20_inverted-repeat.fasta" | "Twistdna,Biontech" | "cloned_gene,cloned_gene" | "vendors-results/vectors/seq_len_1000_gc_35_Homopolymer_20_inverted-repeat-NotI_GS-hIgG2-FcFusionTA.csv" | "true"             | "pTwist CMV hIgG2-Fc"      | "NotI_GS-hIgG2-FcFusionTA"                 |
            | "test-data/seq_len_1000_gc_35_Homopolymer_20.fasta"                 | "Twistdna,Biontech" | "cloned_gene,cloned_gene" | "vendors-results/vectors/seq_len_1000_gc_35_Homopolymer_20-HuIgG2Fc_TAG.csv"                             | "true"             | "pTwist CMV hIgG2"         | "HuIgG2Fc_TAG"                             |
            | "test-data/seq_len_1000_gc_35_inverted-repeat.fasta"                | "Twistdna,Biontech" | "cloned_gene,cloned_gene" | "vendors-results/vectors/seq_len_1000_gc_35_inverted-repeat-Kappa_TAG.csv"                               | "true"             | "pTwist CMV hIgK"          | "Kappa_TAG"                                |
            | "test-data/seq_len_1000_gc_35.fasta"                                | "Twistdna,Biontech" | "cloned_gene,cloned_gene" | "vendors-results/vectors/seq_len_1000_gc_35-Lambda_TAG.csv"                                              | "true"             | "pTwist CMV hIgL2"         | "Lambda_TAG"                               |
            | "test-data/seq_len_1000_gc_45_Homopolymer_10_inverted-repeat.fasta" | "Twistdna,Biontech" | "cloned_gene,cloned_gene" | "vendors-results/vectors/seq_len_1000_gc_45_Homopolymer_10_inverted-repeat-HuIgG4_TAG.csv"               | "true"             | "pTwist CMV hIgG4 S228P"   | "HuIgG4_TAG"                               |
            | "test-data/seq_len_1000_gc_45_Homopolymer_10.fasta"                 | "Twistdna,Biontech" | "cloned_gene,cloned_gene" | "vendors-results/vectors/seq_len_1000_gc_45_Homopolymer_10-HuIgG1Fc_TAG.csv"                             | "true"             | "pTwist CMV hIgG1"         | "HuIgG1Fc_TAG"                             |
            | "test-data/seq_len_1000_gc_45.fasta"                                | "Twistdna,Biontech" | "cloned_gene,cloned_gene" | "vendors-results/vectors/seq_len_1000_gc_45-XhoI_XbaI.csv"                                               | "true"             | "pTwist CMV BG WPRE Neo"   | "XhoI_XbaI"                                |
            | "test-data/seq_len_1000_gc_45.fasta"                                | "Twistdna,Biontech" | "cloned_gene,cloned_gene" | "vendors-results/vectors/seq_len_1000_gc_45-EcoRI_XbaI.csv"                                              | "true"             | "pTwist CMV BG WPRE Neo"   | "EcoRI_XbaI"                               |
            | "test-data/seq_len_1000_gc_45.fasta"                                | "Twistdna,Biontech" | "cloned_gene,cloned_gene" | "vendors-results/vectors/seq_len_1000_gc_45-XhoI_ClaI.csv"                                               | "true"             | "pTwist CMV BG WPRE Neo"   | "XhoI_ClaI"                                |
            | "test-data/seq_len_1000_gc_45.fasta"                                | "Twistdna,Biontech" | "cloned_gene,cloned_gene" | "vendors-results/vectors/seq_len_1000_gc_45-NotI_ClaI.csv"                                               | "true"             | "pTwist CMV BG WPRE Neo"   | "NotI_ClaI"                                |
            | "test-data/seq_len_1000_gc_45.fasta"                                | "Twistdna,Biontech" | "cloned_gene,cloned_gene" | "vendors-results/vectors/seq_len_1000_gc_45-EcoRI_ClaI.csv"                                              | "true"             | "pTwist CMV BG WPRE Neo"   | "EcoRI_ClaI"                               |
            | "test-data/seq_len_1000_gc_50.fasta"                                | "Twistdna,Biontech" | "cloned_gene,cloned_gene" | "vendors-results/vectors/seq_len_1000_gc_50-pST4-Flex.csv"                                               | "true"             | "pST4-Flex"                | "Add Insert incl. TSS, 5UTR, Kozak, Stops" |
            | "test-data/seq_len_1000_gc_65.fasta"                                | "Twistdna,Biontech" | "cloned_gene,cloned_gene" | "vendors-results/vectors/seq_len_1000_gc_65-pST4-v3.0.csv"                                               | "true"             | "pST4-v3.0"                | "Add Insert incl. Kozak and Stops"         |

