resource "aws_sns_topic" "cloudwatch_alarms" {
  count = var.cloudwatch_alarms ? 1 : 0

  tags = local.tags
  name = "cloudwatch-alarms"
}

resource "aws_cloudwatch_metric_alarm" "ec2_cpu_utilization" {
  count = var.cloudwatch_alarms ? 1 : 0

  tags                = local.tags
  alarm_name          = "ec2-cpu-utilization"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 1
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = 60
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "High CPU Utilization (EC2)"
  alarm_actions       = aws_sns_topic.cloudwatch_alarms.*.arn
  ok_actions          = aws_sns_topic.cloudwatch_alarms.*.arn
}
