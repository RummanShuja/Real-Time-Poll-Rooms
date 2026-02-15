# Real-Time Poll Rooms

A full-stack web application that allows users to create polls, share them via a unique link, and collect votes with real-time result updates across all connected viewers.

## Tech stack used:
### Frontend
* React (UI framework)
* Vite (build tool + dev server)
* React Router (client-side routing)
* Axios (HTTP requests)
* Socket.io-client (realtime communication)
* Tailwind CSS (styling)

### Backend
* Node.js (JavaScript runtime environment)
* Express (web framework built on Node)
* MongoDB (database)
* Mongoose (ODM for MongoDB)
* Socket.io (WebSocket abstraction for realtime communication)

---

## Features

* Create a poll with a question and multiple options (minimum 2).
* Automatically generate a unique shareable link for each poll.
* Anyone with the link can view and vote.
* Real-time vote updates across all viewers using WebSockets.
* Persistent storage — polls and votes remain after refresh or server restart.
* Basic fairness controls to reduce repeat or abusive voting.
* Recently visited polls stored locally for better UX.

---

## Architecture Overview

Frontend:

* React handles UI and routing.
* Axios communicates with backend REST APIs.
* Socket.io-client listens for real-time vote updates.

Backend:

* Express handles REST endpoints.
* MongoDB stores poll data persistently.
* Socket.io manages real-time room-based updates.

Each poll corresponds to a Socket.io "room".
Users viewing the same poll join the same room.
When a vote occurs, the backend updates the database and emits the updated poll state to that room.

---

# Fairness / Anti-Abuse Mechanisms

### 1) One Vote Per IP Address (Server-Side Enforcement)

Each poll document stores a list of IP addresses that have already voted.

When a vote request is received:

* The backend checks if the IP address exists in the poll’s `voters` array.
* If it exists, the vote is rejected.
* If not, the vote is recorded and the IP is stored.

This prevents:

* Repeated voting from the same network/device.
* Basic refresh-based abuse.
* Script-based repeat submissions from the same IP.

Limitations:

* Multiple users on the same network share an IP.
* Users can potentially bypass this using VPNs.

---

### 2) Client-Side Vote Lock Using Local Storage

After a user votes:

* The frontend stores the selected option index in `localStorage`.
* The voting buttons are disabled if a stored vote exists.

This prevents:

* Accidental double-clicking.
* Repeated voting via page refresh.
* Basic client-side manipulation attempts.

Limitations:

* Users can clear localStorage manually.
* This is not secure by itself (hence combined with IP enforcement).

---

The combination of server-side IP tracking and client-side locking provides layered protection suitable for an informal polling system.

---

# Edge Cases Handled

* Poll creation requires:

  * Non-empty question.
  * At least two options.
* Invalid poll ID:

  * Returns 404 or error message.
* Voting on non-existent option index:

  * Request rejected.
* Double voting attempt from same IP:

  * Returns 403 response.
* Zero total votes:

  * Percentage calculation safely handles division-by-zero.
* Realtime:

  * Socket listeners cleaned up on component unmount to prevent duplicate handlers.
* Duplicate poll entries in "recently visited" list are filtered out.

---

# Known Limitations

1. IP-based voting restriction is not foolproof:

   * Users behind shared networks may block each other.
   * VPN usage can bypass restrictions.

2. No authentication:

   * Poll ownership is not tracked.
   * Users cannot manage or delete polls.

3. Votes cannot be modified after submission:

   * This simplifies integrity but limits flexibility.

4. No CAPTCHA or rate limiting:

   * High-volume automated abuse is not mitigated.

5. Poll expiration not implemented:

   * Polls remain open indefinitely.

---

# Possible Improvements

In future, I would implement:

* User authentication (optional anonymous mode).
* Signed vote tokens instead of IP-based tracking.
* Rate limiting middleware for vote endpoint.
* Poll expiration time.
* Editable poll settings for creators.
* Better mobile responsiveness and UI polish.
* Database indexing for scalability.

---
