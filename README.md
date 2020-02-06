# StatusPage Webhook

Webhook-based automation for StatusPage Component status.

## Purpose

There is no easy, out of the box way to automate moving a StatusPage Component
between DOWN and UP based on a DataDog Monitor alerting and resolving.

StatusPage components are (only) automated by sending an email to a magic
address with "UP" or "DOWN" in the subject line.

DataDog Monitors cannot notify by sending emails:

- In my testing, the documented sending of an email to an arbitrary address does
  not work; you can only send emails to (verified) team members' emails
- Even if that worked, the subject of the email is hard-coded as the title of
  the Monitor
- Even if the title/subject were editable, the conditional "UP" or "DOWN"
  content could not be added since `{{is_alert}}` template variables don't work
  there

However, DataDog has a very flexible Webhooks integration. Therefore, some glue
code which accepts a Webhook and sends an email is our current solution to this
problem.

## Deployment

### Pre-requisites

- A (non-global) [Serverless][] installation: `npm install serverless`
- Ambient AWS configuration for the desired account, and appropriate permissions
- [Verification][] in SES to send from the configured email address

[serverless]: https://serverless.com/
[verification]: https://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-addresses-and-domains.html

### Deploy

```console
./node_modules/.bin/serverless deploy
```

## API

Perform a `POST` to your deployed endpoint with the following body:

```json
{
  "message": "...",
  "tags": "...,statuspage-component-email:{...},..."
}
```

Where `message` contains the string `UP` or `DOWN` anywhere and `tags` contains
the Automation email address for the desired StatusPage Component at the key
shown.

Because DataDog cleanses tag values of special characters, we "un-cleanse" the
value back to the correct email address by assuming it was originally of the
format:

```
component+{...}@notifications.{...}
```

And expecting we will see

```
component_{...}_notifications.{...}
```

Instead.

If you're *not* using this with DataDog, and you can `POST` the email address as
it is, this transformation should not be harmful -- but FYI anyway.

## Usage with DataDog

1. Tag your Monitor with the Component Automation address

   ```
   statuspage-component-email:component+{...}@notifications.statuspage.io
   ```

1. Add a Webhooks Integration

   - **URL**: your Serverless application's endpoint
   - **Payload**:

     ```json
     {
       "message": "$EVENT_MSG",
       "tags": "$TAGS"
     }
     ```

1. Update your Monitor to notify the Webhook integration with UP or DOWN

   ```
   @webhook-xyz

   {{#is_alert}}DOWN{{/is_alert}}
   {{#is_recovery}}UP{{/is_recovery}}
   ```

## Testing

To run unit tests:

```
npm run test
```

(There's also `npm run test.watch`.)

To deploy to development stage and invoke using a mock UP event:

```console
% npm run deploy
% npm run invoke.up
{
    "statusCode": 200,
    "headers": {},
    "body": "Updated component+82804938-8678-43c8-92ac-92ac28940d07@notifications.statuspage.io to UP.\n"
}
```

## Release

- Update version in `package.json`

- Deploy to production stage

  ```console
  npm run deploy.prod
  ```

- Tag in Git

  ```console
  git tag -s -m vX.Y.Z vX.Y.Z
  ```

---

[LICENSE](./LICENSE) | [CHANGELOG](./CHANGELOG.md)
