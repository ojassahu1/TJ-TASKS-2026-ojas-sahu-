TJ-TASKS-2026-ojas-sahu
Hi, I’m Ojas Sahu, a first-year B.Tech CSE Core student. I enjoy programming and I’m interested in:

Improving my problem-solving skills.

Full-stack development with AI integration.

Using AI to build useful and innovative products.

This repository contains my submission for the Fresher Interview 2026.

Website Planning
Before building the website, I planned the following sections:

A navigation bar.

An introduction and hero section.

Exercise images.

Three pricing plans with different features.

A responsive layout that requires scrolling.

Development Process
For the detailed implementation, I focused on:

Resetting the default spacing and fonts.

Structuring each section using Flexbox and CSS Grid.

Applying a consistent color palette.

Adjusting sizes and spacing.

Adding finishing touches such as hover effects, icons, shadows, and diagonal clip-path designs.

How the Code Works
The project uses three main files:

index.html

style.css

script.js

1. HTML (index.html)
The HTML file provides the structure of the website.

Navbar (<header class="nav">): Contains the gym logo, mobile menu toggle (#nav-toggle), and navigation links for Home, Programs, Gallery, Pricing, and Contact.

Hero Section (#home): Displays the main banner, headline, description, and call-to-action buttons.

Stats (.stats): Shows details such as 500+ members, 12 trainers, 40+ stations, and 7 days open.

Programs (#programs): Contains four workout categories: Strength, Cardio, Coaching, and Women’s Strength.

Gallery (#gallery): Displays gym images in a grid layout using different image sizes such as .g-tall and .g-wide.

Pricing (#pricing): Includes three membership plans: Bronze, Silver, and Gold, along with their features and a monthly/yearly billing toggle.

Modals: Includes a lightbox for viewing gallery images and a booking modal for requesting a free trial pass.

Back to Top Button (#back-to-top): Allows users to quickly return to the top of the page.

2. CSS (style.css)
The CSS file controls the design, layout, and responsiveness of the website.

Colors (:root): Uses variables such as --black, --charcoal, and --ember to create a dark gym-themed design.

Fonts: Uses Oswald for headings and Inter for body text.

Layouts: Uses CSS Grid for the program cards, pricing plans, and image gallery, while Flexbox is used for the navbar and buttons.

Diagonal Designs: Uses clip-path: polygon(...) to create sharp, modern edges on the hero section and cards.

Responsive Design:

@media (max-width: 960px): Changes four-column layouts into two columns and stacks the pricing cards on tablets.

@media (max-width: 700px): Hides the desktop navigation links and displays a mobile menu drawer.

@media (max-width: 540px): Stacks the buttons and adjusts spacing for smaller screens.

3. JavaScript (script.js)
The JavaScript file handles the interactive features of the website.

Mobile Menu: Opens and closes the navigation menu on smaller screens. It also changes the hamburger icon into an “X”.

ScrollSpy: Highlights the active navigation link based on the section currently visible on the screen.

Navbar Shadow: Adds a darker background and blur effect to the navbar after scrolling 40 pixels.

Stat Counter Animation: Animates the numbers in the statistics section when it comes into view.

Monthly/Yearly Pricing Toggle: Updates the displayed prices and applies a 20% discount for yearly plans.

Gallery Lightbox: Opens a full-screen image viewer when an image is clicked. Users can navigate using the Previous and Next buttons, arrow keys, or mobile swipes.

Booking Modal: Opens a form when users select “Book a free visit” or “Start with [Plan]”. After submitting the form, a confirmation message is displayed.

Back to Top Button: Appears after scrolling and smoothly returns the user to the top of the page.

How to Run Locally
Open index.html in a web browser such as Chrome, Edge, or Firefox.

Alternatively, open the project in VS Code and use the Live Server extension.

Deployed Project
View the deployed project
