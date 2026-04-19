# New Leaf

A community-focused tracker and support space for teens navigating the process of quitting tobacco usage and vaping. Originally created for my high school's TUPE committee's Take Down Tobacco Multimedia Competition as well as Hack Club's Sleepover event.

## Features
**Daily Tracker and Calendar**
* Log specific cravings, including intensity and situational triggers.
* View daily patterns and craving frequency on a color-coded visual calendar.

**Growth Engine**
* Track overall recovery progress through a growing digital plant!
    * Milestones are based on total cravings resisted rather than consecutive days
    * Progress pauses during a slip-up instead of resetting to zero
* Breathing Exercises
    * Access immediate calming exercises during intense cravings
    * Follow animated 4-2-4 and box breathing timers
    * Type out worries into a visual release tool that clears them from the screen
    * Complete a guided 5-4-3-2-1 sensory countdown
    * Use a tactile anchor tool that requires a continuous 10-second screen hold to focus the hands and mind
* Guided Journal Entries
    * Log daily entries starting with a color-coded mood selection
    * Answer optional writing prompts focused on positive reflection and habit building
    * Review past entries in a chronological history feed
* Anonymous Community Forum
    * Post and read community notes without usernames or profiles
    * Filter the main feed by specific categories like wins, struggles, or tips from other users
    * Interact with others using a single Send Support button
    * Read and reply to specific posts and comments through nested threads
* Educational Library (Learn tab)
    * Read formatted articles about the neuroscience of addiction
    * Learn evidence-based coping strategies and habit replacement techniques

## Tech Stack

React, vite, typescript, tailwindcss, shadcn, etc.

## Installation Guide
Follow these steps to run the project locally on your machine.

1. Clone the repository
```bash
git clone [https://github.com/djarty24/new-leaf.git](https://github.com/djarty24/new-leaf.git)
```

2. Open the directory and install dependencies
```bash
cd new-leaf
npm install
npm run dev
```

3. View the app by navigating to the local host link provided in your terminal (usually http://localhost:5173).


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
        - Shadcn CLI failed to locate the `@/*` path alias. Modern Vite setups split TypeScript configuration across multiple files
        - Fixing the alias issue took a long time to pinpoint and resolve but eventually, by explicitly defining `baseUrl: "."` and the `paths` object in the root `tsconfig.json` the imports went through!
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
    * Switched from manual Markdown rendering to automatically overriding Tailwind styles
    * Added 5 educationa articles on a variety of health-related topics
8. Added a variety of calming exercises to help users through moments of high stress
    * Upgraded the "I need help right now" button from a single breathing timer into a full toolkit with five different calming options
        1. 424 breathing animation - this was the default and I just kept it the same
        2. Box breathing exercises
        3. An option to write down your worries and let them go by watching them float off screen
        4. 5 senses exercise for grounding
        5. A 10 second Anchor holding exercise
    * Added the ability to easily restart and repeat exercises
    * Improved the design so the toolkit fits on mobile phones and computer screens without stretching
9. [WIP] Creating a growth tree!
    * Introduce positive gamification that rewards resilience rather than punishing users for breaking their streak
    * Designed a visual plant that evolves (from a Seed to a Mighty Tree) based purely on the *total* number of cravings resisted. If a user slips up their growth just pauses, rather than their whole plant dying
    * Created a calculator that scans the user's logs in real-time to match their resisted cravings against tiered thresholds + a smooth progress bar
10. Updating the README and fixing stylistic issues
    * Fixed the anchor breathing animation
    * Clearly detailing each of the features and how New Leaf works
    * Finalizing Sleepover submission, then decided against submitting to Sleepover just yet - I'd rather have the full web app working than submit a demo
    * Set up Firebase console and one-time link authentication magic link
11. Transitioned from local storage to a live Firebase backend
    * Migrated the Journal and Craving Tracker from local state to Firebase Firestore
    * Real users get cloud syncing, while reviewers/guests are served pre-loaded demo data just for testing
    * Resolved a bug where past-dated logs were being overwritten with current timestamps
    * Configured Firestore Security Rules
    * Implemented Magic Link auth for secure sign in
12. Fixed Firebase and code cleanup
    * Added Google sign in due to free-tier email quotas for Magic Link
    * Fixed a race condition to keep users logged in after
    * For the community tab I hooked the community feed to Firestore and made it completely anonymous
    * The app is pretty much ready to deploy at this point - all that's left is updating README and deploying on Vercel and designing a logo!

---
<div align="center">

### Made with ♡ by Revati Tambe.
</div>