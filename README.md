# auditPlayground 🧪

A curated collection of intentionally vulnerable environments for reproducing and analyzing real-world CVEs and security flaws in isolation — all containerized with Docker.  

Perfect for **learning**, **hands-on experimentation**, and **security research**.

---

## 🔍 Index of Labs

### SQL Injection (SQLI)
- **[CVE-2025-29744](https://github.com/awwfensive/auditPlayground/tree/main/SQLI/CVE-2025-29744)** – SQL Injection in `pg-promise` (Node.js ORM)  

### Insecure Direct Object Reference (IDOR)
- **[SWAP](https://github.com/awwfensive/auditPlayground/tree/main/IDOR/swap)** – Classic ID swap vulnerability.  
- **[SWAPTWO](https://github.com/awwfensive/auditPlayground/tree/main/IDOR/swapTwo)** – ID swap with MD5-hashed file names.  
- **[RacingObject](https://github.com/awwfensive/auditPlayground/tree/main/IDOR/RacingObject)** – Race-condition-based IDOR exploiting delayed ownership assignment.  

---

> 💡 More labs coming soon...
