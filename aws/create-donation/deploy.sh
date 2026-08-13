#!/usr/bin/env bash
# Deploy the create-donation Lambda (AWS Amplify hosting's dynamic tier).
#
# Idempotent: creates the function on first run, updates code on later runs.
# Run from anywhere; operates on its own directory. Requires AWS credentials
# for the OpenMined account (the same ones `aws sts get-caller-identity`
# shows) and an existing role — see README.md in this directory for the
# one-time role/parameter/rewrite setup.
#
# The secret itself is NEVER touched here: the function reads SSM parameter
# $SSM_PARAM at runtime. Arm/rotate it with:
#   aws ssm put-parameter --region us-west-1 \
#     --name /openmined-org/STRIPE_SECRET_KEY --type SecureString \
#     --value 'sk_…' --overwrite
set -euo pipefail
cd "$(dirname "$0")"

REGION=us-west-1
FN=openmined-org-create-donation
ROLE_ARN=$(aws iam get-role --role-name openmined-org-create-donation --query Role.Arn --output text)

# donation.mjs is owned by src/data — copy fresh so the bundle can't drift.
cp ../../src/data/donation.mjs donation.mjs
rm -f fn.zip && zip -q fn.zip index.mjs donation.mjs

if aws lambda get-function --function-name "$FN" --region "$REGION" >/dev/null 2>&1; then
  aws lambda update-function-code --function-name "$FN" --region "$REGION" \
    --zip-file fileb://fn.zip --query FunctionArn --output text
else
  aws lambda create-function --function-name "$FN" --region "$REGION" \
    --runtime nodejs22.x --handler index.handler --role "$ROLE_ARN" \
    --timeout 15 --memory-size 256 --zip-file fileb://fn.zip \
    --environment "Variables={SITE_URL=https://openmined.org,APP_DOMAIN=d1otfqlvqd3jby.amplifyapp.com,SSM_PARAM=/openmined-org/STRIPE_SECRET_KEY}" \
    --query FunctionArn --output text
fi
