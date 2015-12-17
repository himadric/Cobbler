Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
$session = New-ScriptSession -Username "admin" -Password "b" -ConnectionUri "http://cobbler.local"
$RootFolder="C:\Github\Cobbler\data\serialization\master"
$ItemPaths=Get-Content "C:\Github\Cobbler\SitecoreItemPath.txt"
$ItemExtn=".item"
foreach($ItemPath in $ItemPaths)
{
    $ItemPath=$ItemPath.Trim()
    $ItemPath=$ItemPath -replace "/", "\"
    if($ItemPath.Length -gt 0)
    {
        if(-not (($ItemPath.ToLower().Contains("-deployonce")) -and (Test-Path "$($RootFolder)$($ItemPath.ToLower().TrimEnd("-deployonce").Trim())$($ItemExtn)")))
        {
            if($ItemPath.ToLower().Contains("-deployonce"))
            {
                $ItemPath=$ItemPath.ToLower().TrimEnd("-deployonce").Trim()
            }
            Write-Host "Serializing Item: $ItemPath"
            $script = {
            Get-Item -path $params.Path | export-item -ItemPathsAbsolute -Root $params.RootFolder 
            }
            $args = @{
                            "Path" = "master:$($ItemPath)"
                            "RootFolder" = "$RootFolder"
                        }
            Invoke-RemoteScript -ScriptBlock $script -Session $session -ArgumentList $args
        }
    }
}