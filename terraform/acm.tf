module "acm" {
  source  = "terraform-aws-modules/acm/aws"
  version = "4.3.2"

  tags                      = local.tags
  domain_name               = var.app_domain
  zone_id                   = data.cloudflare_zone.main.id
  subject_alternative_names = ["*.${var.app_domain}"]
  create_route53_records    = false
  validation_record_fqdns   = cloudflare_record.validation[*].hostname
}

resource "cloudflare_record" "validation" {
  zone_id         = data.cloudflare_zone.main.id
  count           = length(module.acm.distinct_domain_names)
  name            = element(module.acm.validation_domains, count.index)["resource_record_name"]
  type            = element(module.acm.validation_domains, count.index)["resource_record_type"]
  value           = trimsuffix(element(module.acm.validation_domains, count.index)["resource_record_value"], ".")
  ttl             = 60
  proxied         = false
  allow_overwrite = true
}
