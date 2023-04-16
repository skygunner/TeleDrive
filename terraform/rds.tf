resource "aws_db_subnet_group" "main" {
  tags       = local.tags
  name       = "db-${var.app_env}"
  subnet_ids = aws_subnet.private.*.id
}

resource "aws_db_instance" "db" {
  tags                    = local.tags
  db_name                 = "db_${var.app_env}"
  identifier              = "db-${var.app_env}"
  allocated_storage       = 10
  engine                  = "postgres"
  engine_version          = "12.14"
  instance_class          = "db.t3.micro"
  username                = var.db_username
  password                = var.db_password
  db_subnet_group_name    = aws_db_subnet_group.main.id
  vpc_security_group_ids  = [aws_security_group.db.id]
  skip_final_snapshot     = true
  backup_retention_period = 7
  backup_window           = "22:50-23:20"
}
