## SWAPTWO
**SWAPTWO** is a deliberately vulnerable application showcasing a classic IDOR (Insecure Direct Object Reference) flaw.

In this challenge, file names are stored using an MD5 hash of their original names. While the hashing might seem to obscure the file names, it does not provide actual security, leaving the application vulnerable to a predictable ID swap attack.

### setup instructions
```bash
docker build -t swaptwo .
docker run -p 3000:3000 swaptwo
```
Once the container is running, open http://localhost:3000 in your browser to interact with the lab.