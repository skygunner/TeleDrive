resource "digitalocean_project" "teledrive" {
    name        = "TeleDrive"
    description = "Use Telegram for unlimited cloud storage"
    purpose     = "Web Application"
    environment = "Production"
    is_default  = false
    resources   = [
        digitalocean_droplet.all_in_one.urn,
        # digitalocean_spaces_bucket.teledrive_db_backup_bucket.urn
    ]
}

resource "digitalocean_vpc" "teledrive" {
    name   = "teledrive-${var.digitalocean_region}"
    region = var.digitalocean_region
}

resource "digitalocean_ssh_key" "teledrive" {
  name       = "TeleDrive"
  public_key = file("./id_rsa.pub")
}

resource "digitalocean_droplet" "all_in_one" {
    image      = "ubuntu-20-04-x64"
    name       = "all-in-one.teledrive.io"
    region     = var.digitalocean_region
    size       = "s-1vcpu-1gb" # https://slugs.do-api.dev/
    vpc_uuid   = digitalocean_vpc.teledrive.id
    ssh_keys   = [ 
        digitalocean_ssh_key.teledrive.fingerprint 
    ]
    backups    = true
    monitoring = true
    tags       = [ "all-in-one" ]
}

resource "digitalocean_firewall" "all_in_one" {
    name = "all-in-one"

    droplet_ids = [
        digitalocean_droplet.all_in_one.id
    ]

    inbound_rule {
        protocol         = "tcp"
        port_range       = "22"
        source_addresses = ["0.0.0.0/0", "::/0"]
    }

    inbound_rule {
        protocol         = "tcp"
        port_range       = "80"
        source_addresses = ["0.0.0.0/0", "::/0"]
    }

    inbound_rule {
        protocol         = "tcp"
        port_range       = "443"
        source_addresses = ["0.0.0.0/0", "::/0"]
    }

    inbound_rule {
        protocol         = "icmp"
        source_addresses = ["0.0.0.0/0", "::/0"]
    }

    outbound_rule {
        protocol              = "tcp"
        port_range            = "1-65535"
        destination_addresses = ["0.0.0.0/0", "::/0"]
    }

    outbound_rule {
        protocol              = "udp"
        port_range            = "1-65535"
        destination_addresses = ["0.0.0.0/0", "::/0"]
    }

    outbound_rule {
        protocol              = "icmp"
        destination_addresses = ["0.0.0.0/0", "::/0"]
    }
}

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

# resource "digitalocean_spaces_bucket" "teledrive_db_backup_bucket" {
#     name   = "teledrive-db-backup-bucket"
#     region = var.digitalocean_region
# }
