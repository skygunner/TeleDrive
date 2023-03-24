resource "digitalocean_vpc" "teledrive" {
  name   = "teledrive-${var.digitalocean_region}"
  region = var.digitalocean_region
}
