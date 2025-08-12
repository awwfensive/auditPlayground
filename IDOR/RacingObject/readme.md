## RacingObject
Racing Window is an IDOR (Insecure Direct Object Reference) vulnerability lab designed to demonstrate how race conditions can occur in real-world applications.

## How It Works
1. A user registers and logs in.
2. The user uploads a file.
3. There is a simulated delay before the file is assigned to the uploading user.

In real-world applications, such delays can occur due to various reasons — such as asynchronous processing, background jobs, external service callbacks, or complex multi-step workflows. This lab replicates that behavior to help security researchers understand and exploit race conditions that lead to IDOR vulnerabilities.


### Setup instructions 
```bash
docker build -t racingobject .
docker run -p 3000:3000 racingobject
```
Once the container is running, open http://localhost:3000 in your browser to interact with the lab.