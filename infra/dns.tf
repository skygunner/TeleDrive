resource "cloudflare_record" "teledrive" {
    zone_id = var.cloudflare_zone_id
    name    = "@"
    value   = digitalocean_droplet.all_in_one.ipv4_address
    type    = "A"
}

resource "cloudflare_record" "api_teledrive" {
    zone_id = var.cloudflare_zone_id
    name    = "api"
    value   = digitalocean_droplet.all_in_one.ipv4_address
    type    = "A"
}
