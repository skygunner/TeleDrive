terraform {
    required_providers {
        # https://registry.terraform.io/providers/digitalocean/digitalocean/latest/docs
        digitalocean = {
            source  = "digitalocean/digitalocean"
            version = "~> 2.0"
        }
        # https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs
        cloudflare = {
            source  = "cloudflare/cloudflare"
            version = "~> 3.0"
        }
    }
}

provider "digitalocean" {
    token = var.digitalocean_api_token
}

provider "cloudflare" {
    api_token = var.cloudflare_api_token
}
