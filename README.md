# IntentLock (Browser Extension)

A lightweight, premium Chromium-based browser extension designed for developers and students to maintain deep focus, block internal distractions, and keep long-term professional values top-of-mind. 

Rather than executing absolute domain blocks, this tool leverages a smart URL-filtering engine that permits access to specific educational video sites or other essential web applications, while forcing conscious alignment check-ins on non-educational tabs after configurable intervals. IntentLock integrates seamlessly with a custom Pomodoro system to ensure maximum productivity.

## Key Features

*   **Integrated Pomodoro Engine:** A built-in focus and break timer that communicates with the reminder system. Reminders only trigger during active focus sessions and pause automatically during breaks.
*   **Targeted URL Filter:** Bypasses specific study links (e.g., exact YouTube lecture URLs) rather than whitelisting entire domains, preventing mindless browsing on otherwise productive platforms.
*   **Master Override Switch:** A quick-toggle UI switch to easily disable the extension during rest days without losing saved configurations.
*   **Dynamic Auto-Expanding Textboxes:** Custom-engineered forms that dynamically expand up to 5 lines before activating stylized UI scrollbars for a clean user experience.
*   **Developer UI Dark Mode:** Built with premium dark layouts accented by responsive light-blue neon ambient glows.
*   **State Persistence:** Stores timing parameters, toggle states, and customized strings securely using the `chrome.storage` API.

## Core Tech Stack

*   **Languages:** HTML5, CSS3, JavaScript (ES6+)
*   **APIs Utilized:** Chromium Extension API (`chrome.storage.local`, Content Scripts, `MutationObserver`)

## How to Install Locally

1. Clone or download this project folder to your local machine.
2. Open Opera (or any Chromium browser) and navigate to `opera://extensions`.
3. Toggle **Developer Mode** to **ON** in the upper right corner.
4. Click **Load Unpacked** in the top left and select this project folder.
5. Access the configuration panel immediately via the pinned extension toolbar icon.

## Developer Note

Please don't take this project seriously. It is my first project as a novice programmer. 

I just made this extension for fun and I also need it to fix my habit of procrastination. But in the middle of that i made the extension a bit too much complex and tried to put too much features.