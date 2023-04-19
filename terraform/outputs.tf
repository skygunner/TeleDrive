output "web_server_public_ips" {
  description = "Public IP address of web servers"
  value       = module.app.web_server_public_ips
}

output "alb_dns_name" {
  description = "The DNS name of the load balancer"
  value       = module.app.alb_dns_name
}
