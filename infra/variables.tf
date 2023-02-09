variable "digitalocean_api_token" {
    description = "DigitalOcean API Token"
    sensitive   = true
}

variable "digitalocean_region" {
    description = "DigitalOcean Region"
    default     = "ams3"
}
