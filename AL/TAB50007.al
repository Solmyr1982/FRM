table 50007 "FRM Photoframe Log"
{
    Caption = 'Photoframe Log';

    fields
    {
        field(1; "Entry No."; Integer)
        {
            Caption = 'Entry No.';
            DataClassification = ToBeClassified;
        }

        field(2; "Time Retrieved"; DateTime)
        {
            Caption = 'Time Retrieved';
            DataClassification = ToBeClassified;
        }

        field(3; "Photo URL"; Text[250])
        {
            Caption = 'Photo URL';
            DataClassification = ToBeClassified;
        }

        field(4; "App Version"; Text[250])
        {
            Caption = 'App Version';
            DataClassification = ToBeClassified;
        }
        field(5; "Start Entry No."; Integer)
        {
            Caption = 'Start Entry No.';
            DataClassification = ToBeClassified;
        }
    }
    keys
    {
        key(Key1; "Entry No.")
        {
        }
    }

    fieldgroups
    {
    }
}

