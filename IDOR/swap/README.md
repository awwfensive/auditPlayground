# SWAP
SWAP is a vulnerable application designed to demonstrate a classic IDOR (Insecure Direct Object Reference) vulnerability.

This challenge showcases a straightforward ID swap scenario, where manipulating an identifier in the request can grant unauthorized access to another user’s resources.

### setup instructions
```bash
docker build -t swap .
docker run -p 3000:3000 swap
```
Once the container is running, open http://localhost:3000 in your browser to interact with the lab.