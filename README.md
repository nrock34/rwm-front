# 🌍 RomeWithMe — Frontend (RWM-Front)

### A modern travel platform that started as a personal story

**Live Site:** [https://romewithme.com](https://romewithme.com)

---

## 🧭 About the Project

**RomeWithMe** began as a personal blog during my semester abroad in Rome; but the idea behind it was born much earlier, from the hesitation, fears, and *“what ifs”* that almost stopped me from going in the first place.

The thought of leaving home to step into a new continent was intimidating. I didn’t know the language, I didn’t know the people, and I had no idea what it would feel like to suddenly be surrounded by centuries of unfamiliar culture.  
Money was also a worry; without steady income abroad, I had to save, find external funding, and plan every expense carefully. And then there was the cultural gap.

RomeWithMe grew from those early reflections into a **full-featured web platform**: a place to connect, share, and empower others to experience the world confidently.  
It’s a fusion of storytelling, resources, and technology — designed, built, and deployed end-to-end as a showcase of real-world software engineering.

---

## ⚙️ Tech Stack

``` 
Frontend: Svelte, HTML, JavaScript, TailwindCSS  
Backend: Django (Python), PostgreSQL  
Infrastructure: Cloudflare Workers (Serverless Edge), CI/CD 
Architecture: BFF (Backend for Frontend)  
Additional Systems: Custom Auth System, Custom API, Newsletter System, Error Monitoring  
```

---

## 🚀 Features & Highlights

- 🧩 **Custom Authentication System** — Secure login, registration, and token management built from scratch.  
- ⚙️ **BFF Architecture** — Optimized backend-for-frontend layer for cleaner API communication.  
- 💌 **Newsletter Integration** — Automated email workflows with subscription management.  
- 🧱 **Modular Frontend** — Built with SvelteKit and TailwindCSS for speed and maintainability.  
- 🧑‍💻 **CI/CD Workflow** — Continuous deployment with Cloudflare. 
- 🔍 **Error Monitoring** — Real-time logs and error tracking for production stability.  
- 🌐 **Responsive UI** — Fully mobile-ready, with optimized components for performance.  

---

## 🧰 Getting Started

### Prerequisites

- Node.js 22 or newer (see `.nvmrc`)
- npm (or yarn / pnpm)
- Wrangler CLI (for Cloudflare Workers deployment)
### Installation

``` 
git clone https://github.com/nrock34/rwm-front.git  
cd rwm-front  
npm install  
```

### Development

``` 
npm run dev  
```

Visit `http://localhost:5173` to preview locally.

### Production Build

```
npm run build  
npm run preview  
```

Deployment is configured for **Cloudflare Workers** via `wrangler.jsonc`.

---

## 🗂 Project Structure

```
/
├── src/                      # SvelteKit source code: routes, components, stores  
├── static/                   # Static assets (images, icons, etc.)  
├── svelte.config.js          # SvelteKit configuration  
├── tailwind.config.js        # Tailwind setup  
├── vite.config.js            # Vite build configuration  
├── wrangler.jsonc            # Cloudflare deployment settings  
├── package.json  
└── jsconfig.json  
```

---

## 💡 Key Takeaways

This project demonstrates:

- Building a **scalable frontend architecture** from the ground up.  
- Integrating **Cloudflare Workers** for serverless deployment.  
- Managing **auth flows, APIs, and CI/CD** pipelines independently.  
- Applying **UI/UX best practices** through responsive and accessible design.  

It’s not just a blog — it’s a complete web application built to scale.

---

## 🛠 Future Enhancements

- Community dashboard with post analytics  
- Interactive map integrations  
- Advanced content editor for travel stories   
- Progressive Web App (PWA) support  

---

## 👤 About the Developer

**Created & developed by Naeem Hawkins**  
Frontend Engineer | Full Stack Developer | Creative Technologist  

- 🌐 Portfolio: --
- 💼 LinkedIn: [linkedin.com/in/naeemhawkins](https://linkedin.com/in/naeemhawkins)  
- ✉️ Email: --

---

## ?? License

```
� 2025 Naeem Hawkins.

This code is provided for educational and portfolio review purposes only.
You may read, reference, or share this repository for demonstration purposes,
but you may not copy, modify, or use any part of it in your own projects or products.
```
