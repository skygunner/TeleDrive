resource "digitalocean_monitor_alert" "high_cpu_usage_alert" {
    enabled     = true
    description = "High CPU Usage"
    type        = "v1/insights/droplet/cpu"
    compare     = "GreaterThan"
    value       = 80
    window      = "10m"
    entities    = [
        digitalocean_droplet.all_in_one.id,
    ]
    alerts {
        email = [
            "rashad.ansari@teledrive.io",
        ]
    }
}

resource "digitalocean_monitor_alert" "high_cpu_load_alert" {
    enabled     = true
    description = "High CPU Load"
    type        = "v1/insights/droplet/load_15"
    compare     = "GreaterThan"
    value       = 0.6
    window      = "10m"
    entities    = [
        digitalocean_droplet.all_in_one.id,
    ]
    alerts {
        email = [
            "rashad.ansari@teledrive.io",
        ]
    }
}

resource "digitalocean_monitor_alert" "high_memory_usage_alert" {
    enabled     = true
    description = "High Memory Usage"
    type        = "v1/insights/droplet/memory_utilization_percent"
    compare     = "GreaterThan"
    value       = 80
    window      = "10m"
    entities    = [
        digitalocean_droplet.all_in_one.id,
    ]
    alerts {
        email = [
            "rashad.ansari@teledrive.io",
        ]
    }
}

resource "digitalocean_monitor_alert" "high_disk_usage_alert" {
    enabled     = true
    description = "High Disk Usage"
    type        = "v1/insights/droplet/disk_utilization_percent"
    compare     = "GreaterThan"
    value       = 60
    window      = "10m"
    entities    = [
        digitalocean_droplet.all_in_one.id,
    ]
    alerts {
        email = [
            "rashad.ansari@teledrive.io",
        ]
    }
}

resource "digitalocean_uptime_alert" "api_uptime_alert_downtime" {
    name       = "TeleDrive API Down"
    type       = "down_global"
    comparison = "less_than"
    threshold  = 1
    period     = "2m"
    check_id   = "${digitalocean_uptime_check.api_uptime_check.id}"
    notifications {
        email = [
            "rashad.ansari@teledrive.io",
        ]
    }
}

resource "digitalocean_uptime_alert" "web_uptime_alert_downtime" {
    name       = "TeleDrive Web Down"
    type       = "down_global"
    comparison = "less_than"
    threshold  = 1
    period     = "2m"
    check_id   = "${digitalocean_uptime_check.web_uptime_check.id}"
    notifications {
        email = [
            "rashad.ansari@teledrive.io",
        ]
    }
}

resource "digitalocean_uptime_alert" "api_uptime_alert_ssl_expiry" {
    name       = "TeleDrive API SLL Renew"
    type       = "ssl_expiry"
    comparison = "less_than"
    threshold  = 10
    period     = "2m"
    check_id   = "${digitalocean_uptime_check.api_uptime_check.id}"
    notifications {
        email = [
            "rashad.ansari@teledrive.io",
        ]
    }
}

resource "digitalocean_uptime_alert" "web_uptime_alert_ssl_expiry" {
    name       = "TeleDrive Web SLL Renew"
    type       = "ssl_expiry"
    comparison = "less_than"
    threshold  = 10
    period     = "2m"
    check_id   = "${digitalocean_uptime_check.web_uptime_check.id}"
    notifications {
        email = [
            "rashad.ansari@teledrive.io",
        ]
    }
}
