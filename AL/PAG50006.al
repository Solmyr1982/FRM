page 50006 "Frame Processor Setup"
{
    Caption = 'Frame Processor Setup';
    SourceTable = "Frame Processor Setup";
    DeleteAllowed = false;
    InsertAllowed = false;
    PageType = Card;

    layout
    {
        area(content)
        {
            group(General)
            {
                field("Database Server"; "Database Server")
                {
                }
                field("Database Name"; "Database Name")
                {
                }
                field("Database User"; "Database User")
                {
                }
                field("Database Password"; "Database Password")
                {
                }
                field("Path Prefix"; "Path Prefix")
                {
                }
                field("Time Interval"; "Time Interval")
                {
                }
                field("Night Time Start"; "Night Time Start")
                {
                }
                field("Night Time End"; "Night Time End")
                {
                }
            }
        }
    }

    actions
    {
    }

    trigger OnOpenPage()
    begin
        reset;
        if not get then begin
            init;
            id := '00000000-0000-0000-0000-000000000000';
            insert;
        end;
    end;

}

