# Local preview of fia-new-england at http://localhost:8090 (this computer only)
$root = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\fia-new-england'))
$types = @{ '.html'='text/html; charset=utf-8'; '.css'='text/css; charset=utf-8'; '.js'='text/javascript; charset=utf-8'; '.svg'='image/svg+xml'; '.jpg'='image/jpeg'; '.png'='image/png' }
$l = New-Object Net.HttpListener
$l.Prefixes.Add('http://localhost:8090/')
$l.Start()
Write-Host 'Serving on http://localhost:8090/'
while ($l.IsListening) {
  $c = $l.GetContext()
  try {
    $p = [Uri]::UnescapeDataString($c.Request.Url.AbsolutePath).TrimStart('/')
    if (-not $p) { $p = 'index.html' }
    $f = [IO.Path]::GetFullPath((Join-Path $root $p))
    if ($f.StartsWith($root + '\') -and (Test-Path -LiteralPath $f -PathType Leaf)) {
      $b = [IO.File]::ReadAllBytes($f)
      $t = $types[[IO.Path]::GetExtension($f).ToLower()]
      if ($t) { $c.Response.ContentType = $t }
      $c.Response.AddHeader('Cache-Control', 'no-store')
      $c.Response.OutputStream.Write($b, 0, $b.Length)
    } else { $c.Response.StatusCode = 404 }
  } catch { } finally { $c.Response.Close() }
}
