resource "digitalocean_project" "teledrive" {
    name        = "TeleDrive"
    description = "Use Telegram for unlimited cloud storage"
    purpose     = "Web Application"
    environment = "Production"
    is_default  = false
    resources   = []
}

resource "digitalocean_vpc" "teledrive" {
    name   = "teledrive-${var.digitalocean_region}"
    region = var.digitalocean_region
}

resource "digitalocean_ssh_key" "teledrive" {
  name       = "TeleDrive"
  public_key = file("./id_rsa.pub")
}
