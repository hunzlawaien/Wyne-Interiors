# Wyne Interiors — Interior Design Website

## Overview

Wyne Interiors is a responsive, multi-page website for an interior design studio. It presents the studio's design approach, services, selected projects, and contact information through a clean, image-focused interface.

The website is designed to give visitors an overview of the studio's work and make it easier for potential clients to explore its services and get in touch.

## Features

- **Home page:** Introduces the studio, showcases selected work, and highlights its design approach.
- **About page:** Shares the studio's philosophy and approach to interior design.
- **Services page:** Presents the interior design services offered by the studio.
- **Portfolio page:** Displays selected residential and commercial interior projects.
- **Contact page:** Provides a form for visitors to submit project enquiries.
- **Image slider:** Allows visitors to browse featured project images using navigation controls.
- **Light and dark themes:** Lets visitors switch between light and dark appearances. The selected theme is stored in local storage.
- **Typing animation:** Adds a dynamic text effect to the home page.
- **Animated counters:** Displays numerical information using an animation.
- **FAQ interaction:** Supports expandable frequently asked questions where implemented.
- **Form validation:** Checks required contact-form fields and provides validation feedback.
- **Responsive layout:** Uses CSS styling and media queries to adapt the interface to different screen sizes.
- **Navigation menu:** Provides navigation between the website's pages.
- **Back-to-top control:** Helps visitors return to the top of a page.

## Technologies Used

- **HTML5:** Structures the pages and their content.
- **CSS3:** Handles layouts, typography, colors, responsive styling, and visual effects.
- **JavaScript:** Implements interactive elements, theme switching, sliders, counters, form validation, and other interface behavior.
- **Font Awesome:** Provides icons used throughout the interface.
- **Local Storage:** Saves the selected theme in the visitor's browser.

## Project Structure

Wyne Interiors/
│
├── index.html
├── about.html
├── services.html
├── portfolio.html
├── contact.html
├── style.css
├── script.js
│
└── images/
├── about.jpg
├── commercial.jpg
├── commercial1.jpg
├── commercial2.jpg
├── consultation.jpg
├── home-hero.jpg
├── residential.jpg
├── residential1.jpg
├── residential2.jpg
├── residential3.jpg
├── residential4.jpg
├── Slider1.jpg
├── Slider2.jpg
└── Slider3.jpg

## Pages

| File             | Purpose                                      |
| ---------------- | -------------------------------------------- |
| `index.html`     | Main landing page                            |
| `about.html`     | Studio introduction and design philosophy    |
| `services.html`  | Overview of interior design services         |
| `portfolio.html` | Gallery of selected interior projects        |
| `contact.html`   | Contact information and project enquiry form |
| `style.css`      | Shared styling and responsive layouts        |
| `script.js`      | Interactive website functionality            |
| `images/`        | Images used across the website               |

## How to Run the Project

This is a front-end website and does not require a database, backend server, or package installation for basic local use.

1. Download or clone the project repository.
2. Extract the project files if they are in a ZIP archive.
3. Open the `Wyne Interiors` folder.
4. Open `index.html` in a modern web browser.
5. Use the navigation menu to visit the other pages.

For a more convenient development workflow, open the folder in Visual Studio Code and use the Live Server extension to preview the website locally.

## How It Works

The HTML files define the content and structure of each page. The shared CSS file maintains a consistent visual style, while JavaScript adds interactive behavior.

The JavaScript checks which interface elements are available on the current page before attaching their event listeners. This allows shared functionality to be used across multiple pages without requiring every page to contain every interactive component.

The selected theme is saved in browser local storage, allowing the website to restore the saved appearance on a subsequent visit in the same browser.

## Contact Form

The contact form includes client-side validation to help visitors provide the required information before submitting an enquiry.

**Note:** Client-side validation does not, by itself, send an enquiry to an email inbox or store it on a server. A backend or form-handling service is required for actual message delivery.

## Limitations and Future Improvements

Possible future improvements include:

- Connecting the contact form to a backend or email service.
- Adding server-side validation and spam protection.
- Optimizing and compressing large images to improve loading performance.
- Adding additional project details and case studies.
- Improving accessibility testing and cross-browser compatibility.
- Deploying the website to a public hosting platform.
