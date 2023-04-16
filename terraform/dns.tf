resource "cloudflare_record" "app" {
  zone_id = data.cloudflare_zone.main.id
  name    = "@"
  value   = module.alb.lb_dns_name
  type    = "CNAME"
}

resource "cloudflare_record" "api" {
  zone_id = data.cloudflare_zone.main.id
  name    = "api"
  value   = module.alb.lb_dns_name
  type    = "CNAME"
}
