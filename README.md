# 네시모해, Xircle

This project is source code of `4o'clock` server.

> `4o'clock` is a meeting reservation platform for university students. It provides you with lots of places where you can make any kinds of networks. Feel free to make a network in 4o'clock

<br />

Website link: https://www.4oclock.kr

Swagger link: https://api.4oclock.kr/api

<br />

## Project Stack

Following items are core backend technologies used in this project:

- NestJs
- TypeScript
- TypeORM
- PostgreSQL
- AWS
  - Bean stalk
  - Lambda
  - S3
  - CloudFront
  - Route 53

### Infra

- AWS Beanstalk for NodeJs application server deployment
- AWS RDS for Database
- AWS ACM for HTTPS SSL
- AWS S3 for static image
- AWS Cloudfront for S3 origin
- AWS Route53 for sub-domain

## Upcoming Feature

- [x] Chatting
- [x] Review other participants, After meeting

## Challenge

- [x] CloudFront on S3 image origin
- [x] Thumbnail image resizing with Lambda@Edge
- [x] AWS Bean stalk
- [ ] Microservice NestJs server
- [ ] Test code (50% coverage)

