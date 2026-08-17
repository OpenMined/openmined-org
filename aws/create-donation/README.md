# create-donation on AWS

The dynamic tier of the AWS Amplify deployment: a Lambda function serving
`POST /api/create-donation`, reached through an Amplify rewrite (200-proxy) so
the browser stays same-origin. `index.mjs` is the Lambda twin of
`src/pages/api/create-donation.ts` — same request/response contract, same
dormant-until-secret behavior; the header comment there records the two
proxy-imposed differences (secret source, origin derivation).

## Where the secrets live

SSM Parameter Store (us-west-1), SecureString — **two parameters, one per
Stripe mode**:

```
/openmined-org/STRIPE_SECRET_KEY        ← live key; answers ONLY the production origin
/openmined-org/STRIPE_SECRET_KEY_TEST   ← test key; answers staging + PR previews
```

One Lambda serves every host, so which parameter answers is decided per
request from the validated origin (`index.mjs` — exactly `SITE_URL` → live,
everything else → test). Staging and previews therefore can never spend the
live key. This supersedes BACKLOG §14's shared-key acceptance (2026-08-17).

Both are encrypted at rest with the AWS-managed KMS key; readable ONLY by the
Lambda's role (`openmined-org-create-donation`, inline policy
`read-stripe-param`). Read at runtime and cached per warm instance — never
present at build time, never in any artifact. A missing parameter means the
dormant 503 for the hosts it serves; the other hosts are unaffected.

Arm or rotate either one (run by a human, never an agent — swap the name for
the `_TEST` parameter):

```sh
aws ssm put-parameter --region us-west-1 \
  --name /openmined-org/STRIPE_SECRET_KEY --type SecureString \
  --value 'sk_…' --overwrite
```

After rotating, force a config refresh so warm instances drop the cached key:

```sh
aws lambda update-function-configuration --region us-west-1 \
  --function-name openmined-org-create-donation --description "key rotated $(date +%F)"
```

## Code changes

```sh
./deploy.sh   # copies src/data/donation.mjs into the bundle, zips, updates
```

Verify with the repo smoke kit: `npm run smoke -- https://<amplify-host>` —
the `POST /api/create-donation` row should read `dynamic tier LIVE` (dormant
503 or live 200, both pass).

## One-time wiring (already done; recorded for rebuild)

- IAM role `openmined-org-create-donation`: `lambda.amazonaws.com` trust,
  `AWSLambdaBasicExecutionRole`, plus `ssm:GetParameter` on the one parameter.
- Lambda `openmined-org-create-donation` (nodejs22.x, us-west-1) — created by
  `deploy.sh` with env `SITE_URL`, `APP_DOMAIN`, `SSM_PARAM`.
- API Gateway HTTP API `openmined-org-donate` (`fsjjiho8ec`), quick-create
  proxy to the Lambda + `apigateway.amazonaws.com` invoke permission scoped to
  that API. (A Lambda function URL was tried first and 403'd with a correct
  public policy — likely an account-level public-access block; API Gateway
  sidesteps it.)
- Amplify custom rule (FIRST in the list, before the 404 catch-all):
  `/api/create-donation` → 200-proxy to the API's `/api/create-donation`.
