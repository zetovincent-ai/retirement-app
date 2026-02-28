# Define the output file name
$OutputFile = "RFI_ALL_FILES.md"

# Clear the old file if it exists, and start fresh
Set-Content -Path $OutputFile -Value "# Jarvis Repository Payload`n"

# Find all HTML, CSS, and JS files in this folder and subfolders
$Files = Get-ChildItem -Include *.js, *.css, *.html -Recurse | Where-Object { $_.Name -ne $OutputFile }

foreach ($File in $Files) {
    # Determine the correct Markdown language tag
    $Extension = $File.Extension.ToLower()
    $Lang = ""
    if ($Extension -eq ".js") { $Lang = "javascript" }
    elseif ($Extension -eq ".css") { $Lang = "css" }
    elseif ($Extension -eq ".html") { $Lang = "html" }

    # Write the file header
    Add-Content -Path $OutputFile -Value "### File: $($File.Name)"
    
    # Write the opening code block (using string concatenation to avoid escape issues)
    Add-Content -Path $OutputFile -Value ('```' + $Lang)
    
    # Dump the actual code
    $Content = Get-Content -Path $File.FullName -Raw
    Add-Content -Path $OutputFile -Value $Content
    
    # Write the closing code block
    Add-Content -Path $OutputFile -Value '```'
    
    # Add a blank line for spacing between files
    Add-Content -Path $OutputFile -Value ''
}

Write-Host "Bundle complete! Processed $($Files.Count) files into $OutputFile" -ForegroundColor Green