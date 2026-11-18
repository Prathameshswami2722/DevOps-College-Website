# DevOps College Website

A responsive college website created for **Case Study 4: Project Sharing Using GitHub**. The project demonstrates how a local web project can be tracked with Git, connected to a GitHub remote repository, and shared with team members using `git push`.

## Project objective

The fictional **Asteria College** website gives prospective students a polished overview of the college, its programmes, campus experience, admissions and contact information.

## Features

- Responsive layout for desktop, tablet and mobile
- Accessible navigation with a mobile menu and skip link
- Programme, campus and admissions sections
- Lightweight scroll-reveal animations with reduced-motion support
- Built with plain HTML, CSS and JavaScript—no installation required

## Technologies used

- HTML5
- CSS3
- JavaScript
- Git and GitHub

## Run the project

Clone the repository and open `index.html` in a browser:

```bash
git clone https://github.com/Prathameshswami2722/DevOps-College-Website.git
cd DevOps-College-Website
open index.html
```

Alternatively, start a local server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## GitHub workflow used

```bash
git init
git add .
git commit -m "Initial commit: add college website"
git branch -M main
git remote add origin https://github.com/Prathameshswami2722/DevOps-College-Website.git
git push -u origin main
```

## Suggested screenshots for the practical record

1. The GitHub repository home page showing the project files and README.
2. The repository **Commits** page showing the initial commit.
3. The local website running in a browser.
4. The terminal after a successful `git push`.

## Project structure

```text
DevOps-College-Website/
├── screenshots/
│   └── website-home.png
├── index.html
├── style.css
├── script.js
└── README.md
```

> Note: Asteria College is a fictional institution created for this academic demonstration.
