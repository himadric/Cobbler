Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
$session = New-ScriptSession -Username "admin" -Password "b" -ConnectionUri "http://cobbler.qa"
$RootFolder=".\data\serialization\master"
$ItemPaths=Get-Content ".\SitecoreItemPath.txt"
$ItemExtn=".item"
foreach($ItemPath in $ItemPaths)
{
    $IsDeployOnceItem = $FALSE
	$ItemPath=$ItemPath.Trim()
    #$ItemPath=$ItemPath -replace "/", "\"
    if($ItemPath.Length -gt 0)
    {
        if($ItemPath.ToLower().Contains("-deployonce"))
        {
            $IsDeployOnceItem = $TRUE
			$ItemPath=$ItemPath.ToLower().TrimEnd("-deployonce").Trim()
        }
        Write-Host $ItemPath
        $script = {
            if(Test-Path $params.Path)
            {
				if(-not ($Params.DeployOnceFlag))
				{
	                Get-Item -path $params.Path | Import-item -ForceUpdate 
				}
				else
				{
					Write-Log "Skipped"
				}
            }
            else
            {
                $Path=$params.Path
                $ParentPath=$Path.Substring(0,$Path.LastIndexOf("/"))
                Get-Item -path $ParentPath | Import-item -Recurse
            }
        }
        $args = @{
                        "Path" = "master:$($ItemPath)"
						"DeployOnceFlag" = $IsDeployOnceItem
                    }
        Invoke-RemoteScript -ScriptBlock $script -Session $session -ArgumentList $args
    }
}