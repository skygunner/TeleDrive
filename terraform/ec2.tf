resource "aws_key_pair" "main" {
  tags       = local.tags
  key_name   = "ssh-${var.app_env}"
  public_key = file("id_rsa.pub")
}

resource "aws_instance" "web_servers" {
  tags                   = local.tags
  count                  = var.web_server_count
  ami                    = var.aws_ubuntu_ami
  instance_type          = "t3.micro"
  subnet_id              = aws_subnet.public[count.index].id
  key_name               = aws_key_pair.main.key_name
  vpc_security_group_ids = [aws_security_group.ec2.id]

  root_block_device {
    volume_size = 20
  }
}

resource "aws_eip" "web_server_eips" {
  tags     = local.tags
  count    = var.web_server_count
  instance = aws_instance.web_servers[count.index].id
  vpc      = true
}
