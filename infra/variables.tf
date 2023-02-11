variable "digitalocean_api_token" {
    description = "DigitalOcean API Token"
    sensitive   = true
}

variable "digitalocean_region" {
    description = "DigitalOcean Region"
    default     = "ams3"
}

variable "cloudflare_api_token" {
    description = "Cloudflare API Token"
    sensitive   = true
}

variable "cloudflare_zone_id" {
    description = "Cloudflare Zone"
    default     = "e140975e16b0c88a3e96e218aeccc3fb"
}
