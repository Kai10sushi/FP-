param(
  [Parameter(Mandatory=$true, Position=0)]
  [string]$InputAudio,
  [string]$Model = 'Xenova/whisper-small',
  [switch]$Offline
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$ffmpeg = Join-Path $projectRoot 'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe'
$node = (Get-Command node -ErrorAction Stop).Source
$outputDir = Join-Path $projectRoot 'transcripts'
$tempDir = Join-Path $projectRoot '.cache/transcription-tmp'
New-Item -ItemType Directory -Force -Path $outputDir,$tempDir | Out-Null
$tempWav = Join-Path $tempDir ('.audio-' + [guid]::NewGuid().ToString('N') + '.wav')
$sourceName = [System.IO.Path]::GetFileName($InputAudio)
$outputBase = Join-Path $outputDir ([System.IO.Path]::GetFileNameWithoutExtension($sourceName))

try {
  Write-Host 'Converting audio to 16kHz mono PCM WAV...'
  & $ffmpeg -y -hide_banner -loglevel error -i $InputAudio -ar 16000 -ac 1 -c:a pcm_s16le $tempWav
  if ($LASTEXITCODE -ne 0) { throw 'ffmpeg conversion failed.' }
  $arguments = @('scripts/transcribe-audio.mjs', $tempWav, ('--model=' + $Model), ('--source-name=' + $sourceName), ('--output=' + $outputBase))
  if ($Offline) { $arguments += '--offline' }
  & $node @arguments
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
} finally {
  if (Test-Path -LiteralPath $tempWav) { Remove-Item -LiteralPath $tempWav -Force -ErrorAction SilentlyContinue }
}
