# TheDevClub

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-13.4.4-blue)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.1.3-blue)](https://www.typescriptlang.org/)

## Description

TheDevClub is a web application for developers to track progress, set goals, and enhance skills with AI insights. It integrates with GitHub, offers personalized learning recommendations, and fosters a community through leaderboards and badges.

## Table of Contents

- [Installation](#installation)
  - [System Requirements](#system-requirements)
  - [Step-by-Step Setup Guide](#step-by-step-setup-guide)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Features](#features)
- [Screenshots/Demo](#screenshotsdemo)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [Tests](#tests)
- [Roadmap](#roadmap)
- [Known Issues](#known-issues)
- [License](#license)
- [Acknowledgements](#acknowledgements)
- [Contact Information](#contact-information)
- [Changelog](#changelog)
- [References/Resources](#referencesresources)

## Installation

### System Requirements

- Node.js (v14 or later)
- PostgreSQL
- Git

### Step-by-Step Setup Guide

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/bantoinese83/the-club-dev-app.git
    cd your-repo
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up the database:**
    - Create a new PostgreSQL database.
    - Update the `.env` file with your database connection details. (See [Environment Variables](#environment-variables))
4.  **Run database migrations:**
    ```bash
    npx prisma migrate dev
    ```
5.  **Start the development server:**
    ```bash
    npm run dev
    ```

### Environment Variables

Create a `.env` file in the root directory and add the following:

```env
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000" # or your production URL

```
