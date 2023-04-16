module "alb" {
  source  = "terraform-aws-modules/alb/aws"
  version = "8.6.0"

  name               = "alb-${var.app_env}"
  load_balancer_type = "application"
  vpc_id             = aws_vpc.main.id
  subnets            = aws_subnet.public.*.id
  security_groups    = [aws_security_group.alb.id]

  http_tcp_listeners = [
    {
      port        = 80
      protocol    = "HTTP"
      action_type = "redirect"
      redirect = {
        port        = "443"
        protocol    = "HTTPS"
        status_code = "HTTP_301"
      }
    },
  ]

  https_listeners = [
    {
      port            = 443
      protocol        = "HTTPS"
      certificate_arn = module.acm.acm_certificate_arn
    },
  ]

  https_listener_rules = [
    {
      https_listener_index = 0
      actions = [
        {
          type               = "forward"
          target_group_index = 0
        },
      ]
      conditions = [
        {
          host_headers = [var.app_domain]
        },
      ]
    },
    {
      https_listener_index = 0
      actions = [
        {
          type               = "forward"
          target_group_index = 1
        },
      ]
      conditions = [
        {
          host_headers = ["api.${var.app_domain}"]
        },
      ]
    },
  ]

  target_groups = [
    {
      backend_protocol = "HTTP"
      backend_port     = var.web_app_port
      target_type      = "instance"
      health_check = {
        enabled             = true
        interval            = 30
        path                = "/index.html"
        port                = "traffic-port"
        healthy_threshold   = 3
        unhealthy_threshold = 3
        timeout             = 6
        protocol            = "HTTP"
        matcher             = "200-399"
      }
      targets = {
        for index, web_server in aws_instance.web_servers :
        index => {
          target_id = web_server.id
          port      = var.web_app_port
        }
      }
    },
    {
      backend_protocol = "HTTP"
      backend_port     = var.api_app_port
      target_type      = "instance"
      health_check = {
        enabled             = true
        interval            = 30
        path                = "/health"
        port                = "traffic-port"
        healthy_threshold   = 3
        unhealthy_threshold = 3
        timeout             = 6
        protocol            = "HTTP"
        matcher             = "200-399"
      }
      targets = {
        for index, web_server in aws_instance.web_servers :
        index => {
          target_id = web_server.id
          port      = var.api_app_port
        }
      }
    },
  ]

  tags                      = local.tags
  lb_tags                   = local.tags
  target_group_tags         = local.tags
  https_listener_rules_tags = local.tags
  https_listeners_tags      = local.tags
  http_tcp_listeners_tags   = local.tags
}
