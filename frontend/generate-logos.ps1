Add-Type -AssemblyName System.Drawing

$sourcePath = "C:\Users\Virang\.gemini\antigravity-ide\brain\c8788cb8-bd08-4b0d-ab3b-900920d1816d\.user_uploaded\media_1789214151317.png"
$assetsDir = "v:\SIH_2026_Cipher6\frontend\src\assets"
$publicDir = "v:\SIH_2026_Cipher6\frontend\public"

$src = [System.Drawing.Bitmap]::FromFile($sourcePath)

$cropX = 240
$cropY = 95
$cropW = 600
$cropH = 330

$rect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
$croppedAQ = $src.Clone($rect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

# Make white/off-white background transparent
# We iterate and convert white/near-white pixels (R>245, G>245, B>245) to transparent
for ($x = 0; $x -lt $croppedAQ.Width; $x++) {
    for ($y = 0; $y -lt $croppedAQ.Height; $y++) {
        $c = $croppedAQ.GetPixel($x, $y)
        if ($c.R -gt 240 -and $c.G -gt 240 -and $c.B -gt 240) {
            $croppedAQ.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 255, 255, 255))
        }
    }
}

# Create 512x512 transparent canvas
$canvas = New-Object System.Drawing.Bitmap(512, 512, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($canvas)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.Clear([System.Drawing.Color]::Transparent)

$scale = 480.0 / $cropW
$destW = [int]($cropW * $scale)
$destH = [int]($cropH * $scale)
$destX = [int]((512 - $destW) / 2)
$destY = [int]((512 - $destH) / 2)

$g.DrawImage($croppedAQ, $destX, $destY, $destW, $destH)
$g.Dispose()

$canvas.Save("$assetsDir\logo-icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$canvas.Save("$publicDir\logo-icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$canvas.Save("$publicDir\favicon.png", [System.Drawing.Imaging.ImageFormat]::Png)

# 32x32 Favicon
$icon32 = New-Object System.Drawing.Bitmap(32, 32, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g32 = [System.Drawing.Graphics]::FromImage($icon32)
$g32.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g32.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g32.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g32.Clear([System.Drawing.Color]::Transparent)
$g32.DrawImage($canvas, 0, 0, 32, 32)
$g32.Dispose()

$icon32.Save("$publicDir\favicon.ico", [System.Drawing.Imaging.ImageFormat]::Icon)
$icon32.Dispose()

$canvas.Dispose()
$croppedAQ.Dispose()
$src.Dispose()

Write-Output "Transparent AQ Icon generated successfully!"
