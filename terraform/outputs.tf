output "web_server_public_ips" {
  description = "Public IP address of web servers"
  value       = aws_eip.web_server_eips.*.public_ip
}

output "alb_dns_name" {
  description = "The DNS name of the load balancer"
  value       = module.alb.lb_dns_name
}
