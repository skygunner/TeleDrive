variable "app_name" {
  type        = string
  description = "Application name"
  default     = "TeleDrive"
}

variable "app_env" {
  type        = string
  description = "Application environment"
  default     = "production"
}

variable "app_domain" {
  type        = string
  description = "Application domain"
  default     = "teledrive.io"
}

variable "web_app_port" {
  type        = number
  description = "Port number for web application"
  default     = 8080
}

variable "api_app_port" {
  type        = number
  description = "Port number for API application"
  default     = 8000
}

variable "aws_region" {
  type        = string
  description = "AWS region"
  default     = "eu-west-1"
}

variable "aws_ubuntu_ami" {
  type        = string
  description = "AWS Ubuntu AMI for specified region"
  # https://cloud-images.ubuntu.com/locator/ec2/
  default = "ami-06d1a5507784edbad"
}

variable "vpc_cidr_block" {
  type        = string
  description = "CIDR block for VPC"
  default     = "10.0.0.0/16"
}

variable "public_subnet_count" {
  type        = number
  description = "Number of public subnets"
  default     = 2
}

variable "private_subnet_count" {
  type        = number
  description = "Number of private subnets"
  default     = 2
}

variable "public_subnet_cidr_blocks" {
  type        = list(string)
  description = "Available CIDR blocks for public subnets"
  default = [
    "10.0.1.0/24",
    "10.0.2.0/24",
    "10.0.3.0/24",
    "10.0.4.0/24"
  ]
}

variable "private_subnet_cidr_blocks" {
  type        = list(string)
  description = "Available CIDR blocks for private subnets"
  default = [
    "10.0.101.0/24",
    "10.0.102.0/24",
    "10.0.103.0/24",
    "10.0.104.0/24",
  ]
}

variable "db_username" {
  type        = string
  description = "Database username"
  default     = "baseapi"
}

variable "db_password" {
  type        = string
  description = "Database password"
  sensitive   = true
}

variable "web_server_count" {
  type        = number
  description = "Number of web servers"
  default     = 1
}
