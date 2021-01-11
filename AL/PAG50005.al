page 50005 "Frame Processor"
{
    Caption = 'Frame Processor';
    DelayedInsert = true;
    EntityName = 'FrameProcessor';
    EntitySetName = 'FrameProcessor';
    ODataKeyFields = ID;
    PageType = API;
    APIPublisher = 'FRM';
    APIGroup = 'FRM';
    SourceTable = "Frame Processor Setup";
    SourceTableView = SORTING(ID);

    layout
    {
        area(content)
        {
            repeater(Group)
            {
                field(ID; ID)
                {
                }
            }
        }
    }

    actions
    {
    }

    [ServiceEnabled]
    [Scope('Personalization')]
    procedure returnFiveRandomPhotos(appVersion: Text) outParam: Text
    var
        IDs: Array[5] of Integer;
        Paths: Array[5] of Text;
        FrameProcessorSetup: Record "Frame Processor Setup";
        PhotoframeLog: Record "Photoframe Log";
        NextEntryNo: Integer;
    begin
        // http://solmyr.ddns.net:8080/VTM/?company=VTM&page=50006
        FetchPhotoDetailsFromDatabase(IDs, Paths);
        CheckAndReplaceHidden(IDs, Paths);
        FrameProcessorSetup.Get();
        outParam :=
          format(IDs[1]) + ',' + FrameProcessorSetup."Path Prefix" + Paths[1] + ',' +
          format(IDs[2]) + ',' + FrameProcessorSetup."Path Prefix" + Paths[2] + ',' +
          format(IDs[3]) + ',' + FrameProcessorSetup."Path Prefix" + Paths[3] + ',' +
          format(IDs[4]) + ',' + FrameProcessorSetup."Path Prefix" + Paths[4] + ',' +
          format(IDs[5]) + ',' + FrameProcessorSetup."Path Prefix" + Paths[5];

        /*
                PhotoframeLog.LockTable();
                if PhotoframeLog.FindLast() then
                    NextEntryNo := PhotoframeLog."Entry No." + 1
                else
                    NextEntryNo := 1;
                AddLog(NextEntryNo, Paths, appVersion);
                */
    end;

    procedure AddLog(NextEntryNo: Integer; Paths: Array[5] of Text; appVersion: Text)
    var
        PhotoframeLog: Record "Photoframe Log";
        i: Integer;
        FrameProcessorSetup: Record "Frame Processor Setup";
    begin
        FrameProcessorSetup.Get();
        for i := 1 to 5 do begin
            PhotoframeLog.Init();
            PhotoframeLog."Entry No." := NextEntryNo + i - 1;
            PhotoframeLog."Start Entry No." := NextEntryNo;
            PhotoframeLog."Time Retrieved" := CreateDateTime(Today, Time);
            PhotoframeLog."Photo URL" := FrameProcessorSetup."Path Prefix" + Paths[i];
            PhotoframeLog."App Version" := appVersion;
            PhotoframeLog.Insert();
        end;
    end;

    [ServiceEnabled]
    [Scope('Personalization')]
    procedure returnTimeInerval() outParam: Text
    var
        FrameProcessorSetup: Record "Frame Processor Setup";
    begin
        FrameProcessorSetup.Get();
        outParam := format(FrameProcessorSetup."Time Interval");
    end;

    [ServiceEnabled]
    [Scope('Personalization')]
    procedure returnNightTimeStartEnd() outParam: Text
    var
        FrameProcessorSetup: Record "Frame Processor Setup";
    begin
        FrameProcessorSetup.Get();
        outParam := format(FrameProcessorSetup."Night Time Start") + ';' + format(FrameProcessorSetup."Night Time End");
    end;

    local procedure FetchPhotoDetailsFromDatabase(var IDs: Array[5] of Integer; var Paths: Array[5] of Text)
    var
        FRMDBCrawler: DotNet FRMDBCrawler;
        FrameProcessorSetup: Record "Frame Processor Setup";
        RawResponse: Text;
    begin
        FrameProcessorSetup.Get();
        FRMDBCrawler := FRMDBCrawler.FRMDBCrawler();
        RawResponse := FRMDBCrawler.ReturnFiveRandomPhotos(
          FrameProcessorSetup."Database Server",
          FrameProcessorSetup."Database Name",
          FrameProcessorSetup."Database User",
          FrameProcessorSetup."Database Password");
        ParseResponse(RawResponse, IDs, Paths);
    end;

    local procedure CheckAndReplaceHidden(var IDs: Array[5] of Integer; var Paths: Array[5] of Text)
    var
        HiddenIDs: Array[5] of Integer;
        NewIDs: Array[5] of Integer;
        NewPaths: Array[5] of Text;
        i: Integer;
    begin
        while HiddenExists(IDs, HiddenIDs) do begin
            FetchPhotoDetailsFromDatabase(NewIDs, NewPaths);
            for i := 1 to 5 do
                if HiddenIDs[i] = IDs[i] then begin
                    IDs[i] := NewIDs[i];
                    Paths[i] := NewPaths[i];
                end;
        end;
    end;

    local procedure HiddenExists(var IDs: Array[5] of Integer; var HiddenIDs: Array[5] of Integer): Boolean
    var
        PhotoInformation: Record "Photo Information";
        i: Integer;
        Result: Boolean;
    begin
        clear(HiddenIDs);
        for i := 1 to 5 do
            if PhotoInformation.get(IDs[i]) then
                if PhotoInformation.Hide then begin
                    HiddenIDs[i] := IDs[i];
                    Result := true;
                end;
        exit(Result);
    end;

    [ServiceEnabled]
    [Scope('Personalization')]
    procedure addToLog(photoID: Integer; photoPath: Text) outParam: Text
    var
        PhotoInformation: Record "Photo Information";
    begin
        if not PhotoInformation.get(photoID) then begin
            PhotoInformation.Init();
            PhotoInformation."Photo ID" := photoID;
            PhotoInformation."Photo Path" := photoPath;
            PhotoInformation."Added On" := CreateDateTime(Today, Time);
            PhotoInformation.Insert();
        end else begin
            PhotoInformation."Added On" := CreateDateTime(Today, Time);
            PhotoInformation.Modify();
        end;
        outParam := 'success';
    end;

    [ServiceEnabled]
    [Scope('Personalization')]
    procedure hide(photoID: Integer; photoPath: Text) outParam: Text
    var
        PhotoInformation: Record "Photo Information";
    begin
        if not PhotoInformation.get(photoID) then begin
            PhotoInformation.Init();
            PhotoInformation."Photo ID" := photoID;
            PhotoInformation."Photo Path" := photoPath;
            PhotoInformation."Added On" := CreateDateTime(Today, Time);
            PhotoInformation.Hide := true;
            PhotoInformation.Insert();
        end else begin
            PhotoInformation.Hide := true;
            PhotoInformation."Added On" := CreateDateTime(Today, Time);
            PhotoInformation.Modify();
        end;
        outParam := 'success';
    end;

    procedure ParseResponse(RawResponse: Text; var IDs: Array[5] of Integer; var Paths: Array[5] of Text)
    var
        i: Integer;
        ParsedValue: Text;
    begin
        i := 1;
        while StrPos(RawResponse, ';') <> 0 do begin
            ParsedValue := CopyStr(RawResponse, 1, StrPos(RawResponse, ';') - 1);
            RawResponse := CopyStr(RawResponse, StrPos(RawResponse, ';') + 1);
            IF not Evaluate(IDs[i], ParsedValue) then begin
                Paths[i] := ParsedValue;
                i += 1;
            end;
        end;
    end;
}

