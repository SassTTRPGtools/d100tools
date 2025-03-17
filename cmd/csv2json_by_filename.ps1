# powershell -ExecutionPolicy Bypass -File csv2json_by_filename.ps1 spell_all.csv
# Receives the CSV file path as a parameter
param (
    [string]$csvFilePath
)

# Realm to file path mapping
$realmPaths = @{
    "ClericBase" = "spelldata/Channeling/"
    "ClosedChanneling" = "spelldata/Channeling/"
    "DruidBase" = "spelldata/Channeling/"
    "EvilChanneling" = "spelldata/Channeling/"
    "OpenChanneling" = "spelldata/Channeling/"
    "PaladinBase" = "spelldata/Channeling/"
    "RangerBase" = "spelldata/Channeling/"
    "SanctifierBase" = "spelldata/Channeling/"
    "AdeptBase" = "spelldata/Essence/"
    "BardBase" = "spelldata/Essence/"
    "ClosedEssence" = "spelldata/Essence/"
    "DabblerBase" = "spelldata/Essence/"
    "EvilEssence" = "spelldata/Essence/"
    "IllusionistBase" = "spelldata/Essence/"
    "MagicianBase" = "spelldata/Essence/"
    "OpenEssence" = "spelldata/Essence/"
    "HealerBase" = "spelldata/Hybrid/"
    "MysticBase" = "spelldata/Hybrid/"
    "SorcererBase" = "spelldata/Hybrid/"
    "ClosedMentalism" = "spelldata/Mentalism/"
    "EvilMentalism" = "spelldata/Mentalism/"
    "LayHealerBase" = "spelldata/Mentalism/"
    "MagentBase" = "spelldata/Mentalism/"
    "MentalistBase" = "spelldata/Mentalism/"
    "MonkBase" = "spelldata/Mentalism/"
    "OpenMentalism" = "spelldata/Mentalism/"
    "PsychographerBase" = "spelldata/Mentalism/"
}

# Reads the UTF-8 encoded CSV file and converts it to an object
$csvData = Import-Csv -Path $csvFilePath -Encoding UTF8

# Groups data based on the fileName field
$groupedData = @{} # 使用雜湊表來分組資料

foreach ($row in $csvData) {
    $fileName = $row.fileName

    # Check if fileName is in mapping
    if ($realmPaths.ContainsKey($fileName)) {
        $dirPath = $realmPaths[$fileName] # 取得目錄路徑
        $filePath = $dirPath + $fileName + ".json"

        # Check if directory exists, create if not
        if (-not (Test-Path $dirPath -PathType Container)) {
            try {
                New-Item -ItemType Directory -Path $dirPath | Out-Null
                Write-Host "Created directory: $dirPath"
            } catch {
                Write-Error "Failed to create directory: $dirPath - $_"
                continue # Skip to next row if directory creation fails
            }
        }

        try {
            $jsonObject = [PSCustomObject]@{
                "realms"        = $row.realms
                "mainList"      = $row.mainList
                "spellList"     = $row.spellList
                "level"         = [int]$row.level
                "spellName"     = $row.spellName
                "details"       = $row.details
                "areaOfEffect"  = $row.areaOfEffect
                "duration"      = $row.duration
                "range"         = $row.range
                "type"          = $row.type
            }

            # 將 JSON 物件加入到對應的陣列中
            if (-not $groupedData.ContainsKey($fileName)) {
                $groupedData[$fileName] = @()
            }
            $groupedData[$fileName] += $jsonObject

        } catch {
            Write-Error "Error processing row: $_"
        }
    } else {
        Write-Host "File name '$fileName' not found in mapping, skipped."
    }
}

# Output grouped data to JSON files
foreach ($fileName in $groupedData.Keys) {
    $filePath = $realmPaths[$fileName] + $fileName + ".json"
    try {
        $groupedData[$fileName] | ConvertTo-Json -Depth 5 | Out-File -Encoding UTF8 $filePath
        Write-Host "Saved $filePath"
    } catch {
        Write-Error "Error saving file '$filePath': $_"
    }
}

Write-Host "Conversion completed"