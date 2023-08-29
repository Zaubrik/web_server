import { Context, isString, spawnSubprocess } from "../deps.ts";
import { nginxConfigUrl } from "../config.ts";

export async function addDomain<C extends Context>(ctx: C) {
  const body = await ctx.request.json();
  const domain = body?.domain;
  if (isString(domain)) {
    const certbotStdout = await runCertbot(domain);
    const fileContent = await writeNginxConfig(nginxConfigUrl, domain);
    const nginxStdout = await reloadNginx();
    ctx.response = new Response();
    return ctx;
  } else {
    throw new Error("The request body does not contain a 'domain' property.");
  }
}

async function runCertbot(domain: string) {
  const stdout = await spawnSubprocess("certbot", {
    args: ["--nginx", "-d", domain, "-d", `www.${domain}`],
  });
  console.log(stdout);
  return stdout;
}

async function reloadNginx() {
  const stdout = await spawnSubprocess("systemctl", {
    args: ["status", "nginx"],
  });
  console.log(stdout);
  return stdout;
}

async function writeNginxConfig(configDirectory: URL, domain: string) {
  const fileContent = `server {
   listen 80;
   server_name www.${domain} ${domain};

    # Redirect HTTP to HTTPS
   return 301 https://$host$request_uri;
}

server {
    server_name www.${domain} ${domain};

    listen [::]:443 ssl ipv6only=on; # managed by Certbot
    listen 443 ssl; # managed by Certbot

    # SSL certificate paths
    ssl_certificate /etc/letsencrypt/live/${domain}/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/${domain}/privkey.pem; # managed by Certbot

    # SSL settings
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
  #  ssl_protocols TLSv1.2 TLSv1.3;
  #  ssl_ciphers 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384';
  #  ssl_prefer_server_ciphers off;

    # Add HSTS header
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Add OCSP stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;

    # Your Deno server address
    location / {
        proxy_pass http://localhost:8088;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`;
  await Deno.writeTextFile(new URL(domain, configDirectory), fileContent);
  return fileContent;
}
