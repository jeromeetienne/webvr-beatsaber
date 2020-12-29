# self signed certificates
- may be obtained from https://www.selfsignedcertificate.com/

- may be obtained from openssl - replace 192.168.0.2 by your ip address
```sh
openssl genrsa -out 192.168.0.2.key 2048
openssl req -new -x509 -key 192.168.0.2.key -out 192.168.0.2.cert -days 3650 -subj /CN=192.168.0.2
```

# How to Launch http-server with https
```
http-server -S -C certificates/192.168.0.2.cert -K certificates/192.168.0.2.key
```

to install ```http-server```

```npm install http-server```


