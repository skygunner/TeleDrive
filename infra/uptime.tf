resource "digitalocean_uptime_check" "api_uptime_check" {
    enabled = true
    name    = "TeleDrive API"
    type    = "https"
    target  = "https://api.teledrive.io/health"
    regions = [
        "eu_west",
    ]
}

resource "digitalocean_uptime_check" "web_uptime_check" {
    enabled = true
    name    = "TeleDrive Web"
    type    = "https"
    target  = "https://teledrive.io"
    regions = [
        "eu_west",
    ]
}
