# Generate favicon / PWA icons from algoryx-browser-logo.png (AlgoX mark)
$ErrorActionPreference = 'Stop'
$public = Join-Path $PSScriptRoot '..\public'
$srcPath = Join-Path $public 'algoryx-browser-logo.png'
Add-Type -AssemblyName System.Drawing

function Remove-DarkBackground {
  param([System.Drawing.Bitmap]$Bitmap)
  $w = $Bitmap.Width; $h = $Bitmap.Height
  $out = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
      $c = $Bitmap.GetPixel($x, $y)
      $r = [int]$c.R; $g = [int]$c.G; $b = [int]$c.B
      # Black / near-black background -> transparent
      if ($r -le 40 -and $g -le 40 -and $b -le 40) {
        $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, $r, $g, $b))
      } elseif ($r -le 80 -and $g -le 80 -and $b -le 80) {
        $max = [Math]::Max($r, [Math]::Max($g, $b))
        $alpha = [Math]::Max(0, [Math]::Min(255, ($max - 20) * 4))
        $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $r, $g, $b))
      } else {
        $out.SetPixel($x, $y, $c)
      }
    }
  }
  return $out
}

function New-SquareIcon {
  param([System.Drawing.Bitmap]$Source, [int]$Size, [string]$OutPath)
  $side = [Math]::Min($Source.Width, $Source.Height)
  $x = [int](($Source.Width - $side) / 2)
  $y = [int](($Source.Height - $side) / 2)
  $crop = New-Object System.Drawing.Bitmap $side, $side, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $gc = [System.Drawing.Graphics]::FromImage($crop)
  $gc.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
  $gc.Clear([System.Drawing.Color]::FromArgb(0, 0, 0, 0))
  $gc.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $dest = New-Object System.Drawing.Rectangle 0, 0, $side, $side
  $srcRect = New-Object System.Drawing.Rectangle $x, $y, $side, $side
  $gc.DrawImage($Source, $dest, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
  $gc.Dispose()
  $out = New-Object System.Drawing.Bitmap $Size, $Size, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $go = [System.Drawing.Graphics]::FromImage($out)
  $go.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
  $go.Clear([System.Drawing.Color]::FromArgb(0, 0, 0, 0))
  $go.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $go.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $go.DrawImage($crop, 0, 0, $Size, $Size)
  $go.Dispose()
  $crop.Dispose()
  $out.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $out.Dispose()
}

$raw = [System.Drawing.Bitmap]::FromFile($srcPath)
$transparent = Remove-DarkBackground $raw
$raw.Dispose()
$transparent.Save($srcPath, [System.Drawing.Imaging.ImageFormat]::Png)
$transparent.Dispose()

$src = [System.Drawing.Bitmap]::FromFile($srcPath)
@(
  @{ Size = 16;  File = 'favicon-16x16.png' },
  @{ Size = 32;  File = 'favicon-32x32.png' },
  @{ Size = 180; File = 'apple-touch-icon.png' },
  @{ Size = 192; File = 'android-chrome-192x192.png' },
  @{ Size = 256; File = 'algoryx-mark.png' },
  @{ Size = 512; File = 'android-chrome-512x512.png' }
) | ForEach-Object {
  New-SquareIcon $src $_.Size (Join-Path $public $_.File)
}
$src.Dispose()

$bmp32 = [System.Drawing.Bitmap]::FromFile((Join-Path $public 'favicon-32x32.png'))
$bmp32.Save((Join-Path $public 'favicon.ico'), [System.Drawing.Imaging.ImageFormat]::Icon)
$bmp32.Dispose()

Write-Output 'Browser icons generated from algoryx-browser-logo.png'
