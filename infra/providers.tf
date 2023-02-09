terraform {
    required_providers {
        # https://registry.terraform.io/providers/digitalocean/digitalocean/latest/docs
        digitalocean = {
            source  = "digitalocean/digitalocean"
            version = "~> 2.0"
        }
    }
}

provider "digitalocean" {
    token = var.digitalocean_api_token
}
