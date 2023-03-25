output "all_in_one_ipv4_address" {
  description = "All in One Droplet IP Address"
  value       = digitalocean_droplet.all_in_one.ipv4_address
}

output "all_in_one_ipv4_address_private" {
  description = "All in One Droplet IP Address Private"
  value       = digitalocean_droplet.all_in_one.ipv4_address_private
}
