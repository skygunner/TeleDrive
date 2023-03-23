resource "digitalocean_project" "teledrive" {
  name        = "TeleDrive"
  description = "Use Telegram for unlimited cloud storage"
  purpose     = "Web Application"
  environment = "Production"
  is_default  = true
  resources = [
    digitalocean_droplet.all_in_one.urn,
    # digitalocean_spaces_bucket.teledrive_db_backup_bucket.urn
  ]
}
