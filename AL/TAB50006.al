table 50006 "FRM Photo Information"
{
    Caption = 'Photo Information';

    fields
    {
        field(1; "Photo ID"; Integer)
        {
            Caption = 'Photo ID';
            DataClassification = ToBeClassified;
        }
        field(2; "Photo Path"; Text[250])
        {
            Caption = 'Photo Path';
            DataClassification = ToBeClassified;
        }
        field(3; "Added On"; DateTime)
        {
            Caption = 'Added On';
            DataClassification = ToBeClassified;
        }
        field(4; Hide; Boolean)
        {
            Caption = 'Hide';
            DataClassification = ToBeClassified;
        }
    }

    keys
    {
        key(Key1; "Photo ID")
        {
        }
    }

    fieldgroups
    {
    }
}

