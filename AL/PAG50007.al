page 50007 "Photo Information"
{
    Caption = 'Photo Information';
    PageType = List;
    SourceTable = "FRM Photo Information";

    layout
    {
        area(content)
        {
            repeater(Group)
            {
                field("Photo ID"; "Photo ID")
                {
                }
                field("Photo Path"; "Photo Path")
                {
                }
                field("Added On"; "Added On")
                {
                }
                field(Hide; Hide)
                {
                }
            }
        }
    }

    actions
    {
    }
}
