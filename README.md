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

```console
./node_modules/.bin/serverless deploy
```

### Pre-requisites

- A (non-global) [Serverless][] installation: `npm install serverless`
- Ambient AWS configuration for the desired account, and appropriate permissions
- [Verification][] in SES to send from the configured email address

[serverless]: https://serverless.com/
[verification]: https://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-addresses-and-domains.html

### Configuration

The Lambda accepts the following configuration points via environment:

- `FROM_EMAIL`: the From address for automation emails
- `COMPONENT_EMAIL_TAG`: the tag key where we'll find the component email

These can be customized in `package.json`

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

*TODO*

## Testing

To deploy to development stage and invoke using a mock event:

```console
% node_modules/.bin/serverless deploy
% node_modules/.bin/serverless invoke -f components -p mocks/component-up.json
{
    "statusCode": 200,
    "headers": {},
    "body": "Updated component+82804938-8678-43c8-92ac-92ac28940d07@notifications.statuspage.io to UP.\n"
}
```

---

[LICENSE](./LICENSE) | [CHANGELOG](./CHANGELOG.md)
