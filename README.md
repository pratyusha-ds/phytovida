# PhytoVida - Smart Plant Care

![Node.js](https://img.shields.io/badge/Node.js-22.x_LTS-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-3.x-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-27.x-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-Enabled-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**PhytoVida** is a robust and efficient full-stack plant management solution designed to eliminate plant care guesswork. It combines automated scheduling with AI-driven disease diagnostics to ensure your greenery thrives.

**[Live Demo]()** | **[API Documentation]()**

---

## Project Overview

### The Challenge

Modern plant owners face three primary hurdles that lead to poor plant health:

- **Inconsistency:** Busy schedules lead to forgotten watering and care routines.
- **Knowledge Gap:** Identifying diseases (like yellowing leaves or root rot) is difficult for hobbyists.
- **Fragmentation:** Care tips, tracking, and community advice are scattered across different apps and websites.

### The PhytoVida Vision

Our goal is to become the go-to ecosystem for smart gardening by:

1.  **Automating Care:** Eliminating forgetfulness through precision scheduling and smart reminders.
2.  **Democratizing Expertise:** Using AI diagnostics to provide instant, expert-level health insights.
3.  **Building Community:** Centralizing plant care knowledge through a peer-to-peer support network.

---

## Key Features

- **Watering Tracker:** Log and monitor watering history with persistent storage.

- **Smart Reminders:** Automated scheduling based on plant species needs.

- **AI Diagnosis:** Upload photos to identify pests, diseases, and nutrient deficiencies.

- **Community Forum:** Real-time Q&A and knowledge sharing for gardeners.

- **Planting Calendar:** Seasonal guidance and companion planting logic.

---

## Tech Stack

| Layer              | Technology                  | Key Features                                     |
| :----------------- | :-------------------------- | :----------------------------------------------- |
| **Frontend**       | **React 19**                | Hooks, Context API, Tailwind CSS                 |
| **Backend**        | **Node.js 22**              | Express Framework                                |
| **Database**       | **PostgreSQL 17**           | Relational care history & user data              |
| **AI Integration** | **Gemini**                  | Plant health analysis & disease diagnosis        |
| **DevOps**         | **Docker & Docker Compose** | Containerized microservices                      |
| **CI/CD**          | **GitHub Actions**          | Automated **Vitest** runs, linting, & deployment |

---

## Quick Start with Docker

Ensure you have **Docker 27** and **Docker Compose** installed.

1.  **Clone & Enter:**

    ```
    git clone https://github.com/username/phytovida.git && cd phytovida

    ```

2.  **Environment Setup:** Create a `.env`file in the root:

    ```
    DB_PASSWORD=your_secure_password
    AI_API_KEY=your_key_here
    NODE_ENV=production

    ```

3.  **Spin up the Stack:**

    ```
    docker-compose up --build

    ```

    - Frontend:`http://localhost:3000`

    - Backend API:`http://localhost:5000`

    - Postgres:`localhost:5432`

---

## System Architecture

The following flowchart illustrates the architectural workflow:

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#F0FDF4', 'primaryBorderColor': '#166534', 'primaryTextColor': '#166534', 'lineColor': '#64748b', 'fontSize': '14px'}}}%%
flowchart TD
    %% Authentication Header
    Start([User Opens App]) --> Login[User Login]
    Login -->|Authenticate JWT| Dash{DASHBOARD}

    %% Feature Row (Forced Alignment)
    subgraph Features [" "]
        direction LR
        AddPlnt[Add Plant]
        AIAnalyze{"AI ANALYSIS<br/>(Cloud Engine)"}
        VisitForum[Visit Forum]
    end

    %% Connections from Dash to Features
    Dash -->|Core Tracking| AddPlnt
    Dash -->|AI Diagnosis| UploadImg[Upload Image]
    UploadImg --> AIAnalyze
    Dash -->|Social| VisitForum

    %% Branch 1: Care
    AddPlnt --> SetSchedule[Set Watering Schedule]
    SetSchedule --> ScheduleActive([Schedule Active])
    ScheduleActive -.-> Dash

    %% Branch 2: AI
    AIAnalyze -->|"Identify & Detect"| Diagnosis[View Diagnosis]
    Diagnosis --> Recommend[View Recommendation]
    Recommend -.-> Dash

    %% Branch 3: Forum
    VisitForum --> AskQ[Ask Question]
    AskQ --> WaitReply[Wait for Community]
    WaitReply --> CommunityResp[View Responses]
    CommunityResp -.-> Dash

    %% Styling
    style Features fill:none,stroke:none
    style Dash fill:#EFF6FF,stroke:#1D4ED8,stroke-width:2px,color:#1D4ED8
    style AIAnalyze fill:#FFFBEB,stroke:#B45309,stroke-width:2px,color:#B45309
    style Start fill:#F1F5F9,stroke:#475569,color:#475569
    style ScheduleActive fill:#F0FDF4,stroke:#166534,color:#166534
    style CommunityResp fill:#F0FDF4,stroke:#166534,color:#166534
    style Recommend fill:#F0FDF4,stroke:#166534,color:#166534
```

---

## Security & Performance

- **Load Time:** < 3s via optimized React builds and Postgres indexing.

- **Protection:** Bcrypt hashing for passwords and CORS policy headers.

- **Uptime:** 99.9% availability via containerized microservices.

---

## Meet the Team

| Name                     | Role          | Links                                                                                                                |
| :----------------------- | :------------ | :------------------------------------------------------------------------------------------------------------------- |
| **Tunde Ademola Kujore** | Product Owner | [GitHub](https://github.com/Dhemmyhardy) / [LinkedIn](https://www.linkedin.com/in/tundeademolakujore)                |
| **Daniel Kwame Afriyie** | Scrum Master  | [GitHub](https://github.com/dk-afriyie) / [LinkedIn](http://www.linkedin.com/in/danielkafriyie)                      |
| **Katie Hill**           | Web Developer | [GitHub]((https://github.com/KatieHill-Fr-Gr) / [LinkedIn](https://linkedin.com/in/katie-hill-fullstack)             |
| **Alwin Puche**          | Web Developer | [GitHub](https://github.com/awyyyn) / [LinkedIn](https://www.linkedin.com/in/lashtun/)                               |
| **Nadiia Lashtun**       | Web Developer | [GitHub](https://github.com/NadiiaLashtun) / [LinkedIn](https://www.linkedin.com/in/lashtun/)                        |
| **Pratyusha Dasari**     | Web Developer | [GitHub](https://github.com/pratyusha-ds) / [LinkedIn](https://www.linkedin.com/in/pratyusha-ds/)                    |
| **Banto-Laczi Klára**    | Web Developer | [GitHub](https://github.com/bantoklara) / [LinkedIn](https://www.linkedin.com/in/banto-laczi-klara/)                 |
| **Mohamed Ouederni**     | Web Developer | [GitHub](https://github.com/9-barristanselmy-9) / [LinkedIn](https://www.linkedin.com/in/mohamed-ouederni-0bb11ab4/) |

## License

This project is licensed under the MIT License - see the [LICENSE](https://opensource.org/license/mit/) file for details.
