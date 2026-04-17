# New Leaf

A community-focused tracker and support space for teens navigating the process of quitting tobacco usage and vaping. Originally created for my high school's TUPE committee's Take Down Tobacco Multimedia Competition as well as Hack Club's Sleepover event.

## Features
* fill this in later

## Tech Stack

React, vite, typescript, tailwindcss, shadcn, etc.

## Installation Guide
* fill this in later

## Developer Log (for Hack Club's Sleepover event!)
This is an hour by hour log of everything I worked on and when each feature was implemented.

1. Mostly project set up.
    * Set up project boilerplate for my Vite React app
    * Set up README file with the project log
    * Created the Tailwind CSS custom styling palette
    * Set up React Router navigation
    * Started setting up app pages (Tracker.tsx)
2. Set up the UI layout component and ShadCN
    * Added a responsive bottom navigation bar for the `Layout.tsx` wrapper
    * Setting up ShadCN was a challenge due to the imports not going through
        - I encountered a dependency error in to invalid JSX comment placement; resolved by restructuring the DOM nodes
        - Shadcn CLI failed to locate the `@/*` path alias. Modern Vite setups split TypeScript configuration across multiple files (`tsconfig.app.json` and `tsconfig.json`)
        - Fixed the alias issue took a long time to pinpoint and resolve but eventually, by explicitly defining `baseUrl: "."` and the `paths` object in the root `tsconfig.json` the imports went through!
    * Selected a color palette and added that to styles(WIP)
3. 


---
<div align="center">

### Made with ♡ by Revati Tambe.
</div>