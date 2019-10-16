# Auth Toy
This project is aim to demonstrate a minimal implementation of OAuth2.0.

## Preparation
To perform like an implicit client with HTTPS server, we can self-certificate first.
```bash
openssl req -x509 -new -nodes -sha256 -utf8 -days 3650 -newkey rsa:2048 -keyout server.key -out server.crt -config ssl.conf
openssl pkcs12 -export -in server.crt -inkey server.key -out server.pfx
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain server.crt
```
ref: https://blog.miniasp.com/post/2019/02/25/Creating-Self-signed-Certificate-using-OpenSSL

## Run

To start Authorization Server:
```bash
node src/auth-server/index.js
```

To start Client Server:
```bash
node src/client-server/index.js
```

## Demo

### Authorization Code Grant
https://localhost:8080/code_start

### Implicit Grant
https://localhost:8080/implicit_start

### Client Credential Grant
https://localhost:8080/credential_start

## 科普文章
https://medium.com/@liniju/rfc6749-4a14dc5da2f5
