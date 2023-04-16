resource "aws_vpc" "main" {
  tags                 = local.tags
  cidr_block           = var.vpc_cidr_block
  enable_dns_hostnames = true
}

resource "aws_internet_gateway" "main" {
  tags   = local.tags
  vpc_id = aws_vpc.main.id
}

resource "aws_subnet" "public" {
  tags              = local.tags
  vpc_id            = aws_vpc.main.id
  count             = var.public_subnet_count
  cidr_block        = var.public_subnet_cidr_blocks[count.index]
  availability_zone = data.aws_availability_zones.available.names[count.index]
}

resource "aws_subnet" "private" {
  tags              = local.tags
  vpc_id            = aws_vpc.main.id
  count             = var.private_subnet_count
  cidr_block        = var.private_subnet_cidr_blocks[count.index]
  availability_zone = data.aws_availability_zones.available.names[count.index]
}

resource "aws_route_table" "public" {
  tags   = local.tags
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }
}

resource "aws_route_table_association" "public" {
  count          = var.public_subnet_count
  route_table_id = aws_route_table.public.id
  subnet_id      = aws_subnet.public[count.index].id
}

resource "aws_route_table" "private" {
  tags   = local.tags
  vpc_id = aws_vpc.main.id
}

resource "aws_route_table_association" "private" {
  count          = var.private_subnet_count
  route_table_id = aws_route_table.private.id
  subnet_id      = aws_subnet.private[count.index].id
}
