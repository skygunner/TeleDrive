resource "digitalocean_ssh_key" "teledrive" {
  name       = "TeleDrive"
  public_key = file("./id_rsa.pub")
}

resource "digitalocean_droplet" "all_in_one" {
  image    = "ubuntu-20-04-x64"
  name     = "all-in-one.teledrive.io"
  region   = var.digitalocean_region
  size     = "s-1vcpu-1gb" # https://slugs.do-api.dev/
  vpc_uuid = digitalocean_vpc.teledrive.id
  ssh_keys = [
    digitalocean_ssh_key.teledrive.fingerprint,
  ]
  backups    = true
  monitoring = true
  tags       = ["all-in-one"]
}
