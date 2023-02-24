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
        digitalocean_ssh_key.teledrive.fingerprint,
    ]
    backups    = true
    monitoring = true
    tags       = [ "all-in-one" ]
}

resource "digitalocean_firewall" "all_in_one" {
    name = "all-in-one"

    droplet_ids = [
        digitalocean_droplet.all_in_one.id,
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

resource "digitalocean_monitor_alert" "high_cpu_usage_alert" {
    alerts {
        email = [
            "rashad.ansari@teledrive.io",
        ]
    }
    window      = "10m"
    type        = "v1/insights/droplet/cpu"
    compare     = "GreaterThan"
    value       = 80
    enabled     = true
    entities    = [
        digitalocean_droplet.all_in_one.id,
    ]
    description = "High CPU Usage"
}

resource "digitalocean_monitor_alert" "high_cpu_load_alert" {
    alerts {
        email = [
            "rashad.ansari@teledrive.io",
        ]
    }
    window      = "10m"
    type        = "v1/insights/droplet/load_15"
    compare     = "GreaterThan"
    value       = 60
    enabled     = true
    entities    = [
        digitalocean_droplet.all_in_one.id,
    ]
    description = "High CPU Load"
}

resource "digitalocean_monitor_alert" "high_memory_usage_alert" {
    alerts {
        email = [
            "rashad.ansari@teledrive.io",
        ]
    }
    window      = "10m"
    type        = "v1/insights/droplet/memory_utilization_percent"
    compare     = "GreaterThan"
    value       = 80
    enabled     = true
    entities    = [
        digitalocean_droplet.all_in_one.id,
    ]
    description = "High Memory Usage"
}

resource "digitalocean_monitor_alert" "high_disk_usage_alert" {
    alerts {
        email = [
            "rashad.ansari@teledrive.io",
        ]
    }
    window      = "10m"
    type        = "v1/insights/droplet/disk_utilization_percent"
    compare     = "GreaterThan"
    value       = 60
    enabled     = true
    entities    = [
        digitalocean_droplet.all_in_one.id,
    ]
    description = "High Disk Usage"
}

resource "digitalocean_uptime_check" "api_uptime_check" {
    name    = "TeleDrive API"
    target  = "https://api.teledrive.io/health"
    type    = "https"
    regions = [
        "eu_west",
    ]
    enabled = true
}

resource "digitalocean_uptime_check" "web_uptime_check" {
    name    = "TeleDrive Web"
    target  = "https://teledrive.io"
    type    = "https"
    regions = [
        "eu_west",
    ]
    enabled = true
}

resource "digitalocean_uptime_alert" "api_uptime_alert_downtime" {
    name      = "TeleDrive API Down"
    check_id  = "${digitalocean_uptime_check.api_uptime_check.id}"
    type      = "down_global"
    threshold = 1
    period    = "2m"
    notifications {
        email = [
            "rashad.ansari@teledrive.io",
        ]
    }
}

resource "digitalocean_uptime_alert" "web_uptime_alert_downtime" {
    name      = "TeleDrive Web Down"
    check_id  = "${digitalocean_uptime_check.web_uptime_check.id}"
    type      = "down_global"
    threshold = 1
    period    = "2m"
    notifications {
        email = [
            "rashad.ansari@teledrive.io",
        ]
    }
}

resource "digitalocean_uptime_alert" "api_uptime_alert_ssl_expiry" {
    name      = "TeleDrive API SLL Renew"
    check_id  = "${digitalocean_uptime_check.api_uptime_check.id}"
    type      = "ssl_expiry"
    threshold = 10
    period    = "2m"
    notifications {
        email = [
            "rashad.ansari@teledrive.io",
        ]
    }
}

resource "digitalocean_uptime_alert" "web_uptime_alert_ssl_expiry" {
    name      = "TeleDrive Web SLL Renew"
    check_id  = "${digitalocean_uptime_check.web_uptime_check.id}"
    type      = "ssl_expiry"
    threshold = 10
    period    = "2m"
    notifications {
        email = [
            "rashad.ansari@teledrive.io",
        ]
    }
}
