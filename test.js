fetch("https://backenddentist-production-12fe.up.railway.app/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "admin@dentalcare.com", password: "admin123" })
}).then(res => res.json()).then(console.log).catch(console.error);
