# CloudFlare Domain Configuration for Multiple Converters

This guide provides detailed instructions for managing multiple domains on CloudFlare and connecting them to your Vercel-hosted converter variants.

## Domain Management Strategy

For a multi-variant converter project, each variant needs its own domain:
- heicflip.com
- jpgflip.com
- aviflip.com
- etc.

## CloudFlare Setup Process

### 1. Register Domains

If you haven't already:

1. Log in to CloudFlare
2. Go to "Domains" → "Register"
3. Search for and register each domain you need
4. Complete the registration process

### 2. Add Existing Domains to CloudFlare

If you already have domains registered elsewhere:

1. Log in to CloudFlare
2. Click "Add Site"
3. Enter your domain name
4. Select a plan (Free plan is sufficient for most needs)
5. Follow the instructions to update nameservers with your registrar

### 3. Configure DNS for Vercel

For each domain:

1. Go to the domain in CloudFlare dashboard
2. Select "DNS" from the menu
3. Add the appropriate DNS records for Vercel:

**For apex domains (e.g., `heicflip.com`):**
```
Type: A
Name: @
Content: 76.76.21.21
TTL: Auto
Proxy status: Proxied
```

**For www subdomain:**
```
Type: CNAME
Name: www
Content: cname.vercel-dns.com
TTL: Auto
Proxy status: Proxied
```

### 4. SSL/TLS Configuration

For optimal security:

1. Go to "SSL/TLS" in CloudFlare
2. Set encryption mode to "Full (strict)"
3. Enable "Always Use HTTPS"
4. Set minimum TLS version to 1.2

### 5. Configure Page Rules (Optional)

To enforce HTTPS and redirect www to non-www (or vice versa):

1. Go to "Rules" → "Page Rules"
2. Create a rule for HTTP to HTTPS redirect:
   - URL pattern: `http://*yourdomain.com/*`
   - Setting: "Always Use HTTPS"

3. Create a rule for www to non-www redirect (if preferred):
   - URL pattern: `www.yourdomain.com/*`
   - Setting: "Forwarding URL"
   - Status: 301
   - Destination: `https://yourdomain.com/$1`

## Verifying Domain Ownership on Vercel

After configuring DNS in CloudFlare:

1. Go to your Vercel project settings
2. Select "Domains"
3. Add your domain
4. Vercel will verify ownership via the DNS records
5. If verification fails, check your CloudFlare configuration

## Managing Multiple Domains

When managing multiple domains for different variants:

1. Create a spreadsheet or document with all domain details:
   - Domain name
   - Registrar
   - Expiration date
   - DNS configuration
   - Associated variant

2. Set calendar reminders for domain renewals

3. Create a consistent naming pattern for DNS records to stay organized

## CloudFlare Features to Leverage

### Performance

1. Enable Auto Minify (HTML, CSS, JS)
2. Enable Brotli compression
3. Configure caching rules for static assets

### Security

1. Configure Web Application Firewall (WAF)
2. Enable Bot Fight Mode
3. Set up rate limiting rules

### Analytics

1. Enable CloudFlare Analytics to track visitor metrics
2. Set up notifications for unusual traffic patterns

## Troubleshooting CloudFlare Issues

### Domain Not Connecting to Vercel

1. Verify nameservers are correctly set to CloudFlare
2. Check DNS records match Vercel's requirements
3. Temporarily disable CloudFlare proxy to test direct connection
4. Look for error messages in Vercel domain settings

### SSL Certificate Issues

1. Verify SSL mode is set to "Full" or "Full (strict)"
2. Check for certificate validation errors in CloudFlare
3. Ensure DNS is properly configured
4. Allow up to 24 hours for SSL certificate issuance

### Domain Propagation Delays

1. Use tools like [whatsmydns.net](https://www.whatsmydns.net/) to check propagation
2. Remember that DNS changes can take up to 48 hours to fully propagate
3. Test from multiple locations and networks

## Domain Management Best Practices

1. **Auto-Renewal**: Enable auto-renewal for all domains
2. **Contact Info**: Keep registrant contact information up to date
3. **Domain Locking**: Enable domain locking to prevent unauthorized transfers
4. **Email Forwarding**: Set up email forwarding for domain-based emails
5. **Documentation**: Maintain documentation of all domain settings

---

Last updated: April 30, 2025