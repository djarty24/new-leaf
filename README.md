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
3. Worked on the cravings tracker page
    * Created a calendar to show a summary of past logs. The colored rings indicate the intensity of cravings and the number of times the user vaped
    * Created a method to log a current craving, with spaces for emotions, intensity, and time of day
    * Added a quick-access button that triggers a breathing visualizer to help users navigate intense, in-the-moment cravings
4. Finalized `Tracker.tsx` and finished Journals tab
    * Added dropdown menu with reflective prompts to allow users to cycle through a curated list of non-clinical questions
    * Created a color-coded mood selector (Calm, Steady, Sensitive, Reflective) to note down alongside journal entries
    * As of now, created "demo" entries to showcase the vieweing feature (WIP - will later add them to a database)
5. Finalized `Forum.tsx` which is an anonymous community forum network to combat the isolation of recovery
    * Added a community board free of usernames and profiles to encourage genuine sharing
    * Users can expand any post to view comment threads and comment their own encouraging replies
    * A toggle system allowing users to filter the feed
    * Designed an inline post-creation tool at the top of the feed
    * ADD LATER: probably need some sort of moderation system to make sure people can't make inappropriate comments
6. Began working on `Education.tsx`
    * Created an article layout for different educational articles
    * May switch to a database
    * Began integrating Markdown so that articles render nicely
7. Finished `Education.tsx` page and Learn tab
    * Added fields for article author and date written
    * Medical disclaimer (specifically for HHS TUPE)
    

---
<div align="center">

### Made with ♡ by Revati Tambe.
</div>