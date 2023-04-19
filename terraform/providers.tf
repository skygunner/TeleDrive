terraform {
  backend "s3" {
    key = "terraform.tfstate"
  }
}

moved {
  from = module.acm
  to   = module.app.module.acm
}

moved {
  from = cloudflare_record.validation
  to   = module.app.cloudflare_record.validation
}

moved {
  from = module.alb
  to   = module.app.module.alb
}

moved {
  from = aws_sns_topic.cloudwatch_alarms
  to   = module.app.aws_sns_topic.cloudwatch_alarms
}

moved {
  from = aws_cloudwatch_metric_alarm.ec2_cpu_utilization
  to   = module.app.aws_cloudwatch_metric_alarm.ec2_cpu_utilization
}

moved {
  from = cloudflare_record.app
  to   = module.app.cloudflare_record.app
}

moved {
  from = cloudflare_record.api
  to   = module.app.cloudflare_record.api
}

moved {
  from = aws_key_pair.main
  to   = module.app.aws_key_pair.main
}

moved {
  from = aws_instance.web_servers
  to   = module.app.aws_instance.web_servers
}

moved {
  from = aws_eip.web_server_eips
  to   = module.app.aws_eip.web_server_eips
}

moved {
  from = aws_vpc.main
  to   = module.app.aws_vpc.main
}

moved {
  from = aws_internet_gateway.main
  to   = module.app.aws_internet_gateway.main
}

moved {
  from = aws_subnet.public
  to   = module.app.aws_subnet.public
}

moved {
  from = aws_subnet.private
  to   = module.app.aws_subnet.private
}

moved {
  from = aws_route_table.public
  to   = module.app.aws_route_table.public
}

moved {
  from = aws_route_table.private
  to   = module.app.aws_route_table.private
}

moved {
  from = aws_route_table_association.public
  to   = module.app.aws_route_table_association.public
}

moved {
  from = aws_route_table_association.private
  to   = module.app.aws_route_table_association.private
}

moved {
  from = aws_db_subnet_group.main
  to   = module.app.aws_db_subnet_group.main
}

moved {
  from = aws_db_instance.db
  to   = module.app.aws_db_instance.db
}

moved {
  from = aws_security_group.ec2
  to   = module.app.aws_security_group.ec2
}

moved {
  from = aws_security_group.db
  to   = module.app.aws_security_group.db
}

moved {
  from = aws_security_group.alb
  to   = module.app.aws_security_group.alb
}
