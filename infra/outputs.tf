output "all_in_one_ipv4_address" {
    description = "All in One Droplet IP Address"
    value       = digitalocean_droplet.all_in_one.ipv4_address
}

output "all_in_one_ipv4_address_private" {
    description = "All in One Droplet IP Address Private"
    value       = digitalocean_droplet.all_in_one.ipv4_address_private
}

output "db_backup_bucket_domain_name" {
    description = "DB Backup Bucket Domain Name"
    value       = digitalocean_spaces_bucket.teledrive_db_backup_bucket.bucket_domain_name
}

output "db_backup_bucket_endpoint" {
    description = "DB Backup Bucket Endpoint"
    value       = digitalocean_spaces_bucket.teledrive_db_backup_bucket.endpoint
}
