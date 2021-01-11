table 50005 "Frame Processor Setup"
{
    Caption = 'Frame Processor Setup';

    fields
    {
        field(1; ID; Guid)
        {
            Caption = 'ID';
            DataClassification = ToBeClassified;
        }
        field(2; "Database Server"; Text[30])
        {
            Caption = 'Database Server';
            DataClassification = ToBeClassified;
        }
        field(3; "Database Name"; Text[30])
        {
            Caption = 'Database Name';
            DataClassification = ToBeClassified;
        }
        field(4; "Database User"; Text[30])
        {
            Caption = 'Database User';
            DataClassification = ToBeClassified;
        }
        field(5; "Database Password"; Text[30])
        {
            Caption = 'Database Password';
            ExtendedDatatype = Masked;
            DataClassification = ToBeClassified;
        }
        field(6; "Path Prefix"; Text[30])
        {
            Caption = 'Path Prefix';
            DataClassification = ToBeClassified;
        }
        field(7; "Time Interval"; Integer)
        {
            Caption = 'Time Interval';
            DataClassification = ToBeClassified;
        }
        field(8; "Night Time Start"; Time)
        {
            Caption = 'Night Time Start';
            DataClassification = ToBeClassified;
        }
        field(9; "Night Time End"; Time)
        {
            Caption = 'Night Time End';
            DataClassification = ToBeClassified;
        }
    }

    keys
    {
        key(Key1; ID)
        {
        }
    }

    fieldgroups
    {
    }
}

