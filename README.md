# AI-Driven 3D Training Visualization Platform

This repository contains a web-based prototype platform that explores how AI, 3D visualization, and interactive avatars can be combined to support training, learning, and contextual understanding.

The project consists of two prototypes, each building on the previous one to demonstrate increasing levels of interactivity and intelligence.

> **Note:** The focus of this work is clarity, feasibility, and learning, not visual perfection.

---

## Project Overview

The platform demonstrates how:
* **Natural language** can be interpreted into structured actions.
* **3D avatars** can respond to AI-generated commands.
* **Interactive 3D scenes** can enhance training and understanding.

The system is split into two main prototypes:
1. **Prototype 1:** 3D asset visualization & interaction.
2. **Prototype 2:** AI-driven animated training avatar.

---

## Prototype 1 – 3D Asset Visualization

### Description
Prototype 1 focuses on rendering and interacting with 3D assets in a web environment. It demonstrates how static or semi-interactive 3D models can be viewed, inspected, and controlled using a browser-based 3D canvas.

### Key Features
* **Web-based 3D rendering** using Three.js.
* **Camera controls** (rotate, zoom, reset).
* **Clean separation** between UI and 3D scene.
* **Foundation** for mapping real-world asset data to 3D representations.

### Purpose
This prototype establishes the visual and technical foundation for later AI-driven interaction.

---

## Prototype 2 – AI-Driven Training Avatar

### Description
Prototype 2 introduces a humanoid training avatar that responds to natural language commands interpreted by AI. Users can type commands such as:
* *"Wave hello"*
* *"Point at the extinguisher"*
* *"Jump"*
* *"Walk forward"*
* *"Dance"*

The system interprets these commands and plays the corresponding skeletal animation on the avatar in real time.

### Tool 1: Natural Language Command Interpreter
* Accepts free-form user input.
* Uses AI logic to extract user intent.
* Maps intent to predefined avatar actions.
* Returns a short explanation of the action performed.

### Tool 2: Interactive 3D Avatar Viewer
* Renders a humanoid avatar in a WebGL canvas.
* Plays animations stored in a single GLB file.
* **Supports:** Camera rotation, Zoom in/out, and Scene reset.
* Avatar remains anchored while animations play on the skeleton.

---

## Technologies Used

### Frontend
* **Next.js** (React)
* **@react-three/fiber**
* **@react-three/drei**
* **Three.js**

### 3D & Animation
* **Blender** – Assembling avatar and animations.
* **Mixamo** – Humanoid animation source.
* **glTF / GLB** – Optimized 3D asset format.

### AI
* **Custom API route** for command interpretation.
* **Natural language → action mapping**.
* **Human-readable AI explanations**.

---

## AI Systems Used

### Groq (LLM Inference)
Groq is used to interpret natural language commands and map them to structured avatar actions.

* **Model:** `llama-3.1-8b-instant`
* **Purpose:**
    * Convert free-form user input into predefined action labels.
    * Return a short natural-language explanation of the action.
* **Why Groq:**
    * Extremely fast inference.
    * Low latency, ideal for interactive UIs.
    * Accessed via its OpenAI-compatible API endpoint.

### Imagga (Visual Intelligence & Image Recognition)
Imagga is used for:
* **Automated Image Tagging**: Instantly generating descriptive keywords for uploaded images.
* **Visual Content Analysis**: Extracting meaningful data from pixel content to understand the context of the user's photos.
* **Rapid Prototyping**: Leveraging a stable, production-ready computer vision API to accelerate development.

---

## Known Limitations
* Animations are predefined: No procedural motion (physics-based).
* No physics-based interaction: Limited interaction with objects.
* Limited environmental awareness: The avatar is not aware of surroundings.
* AI interpretation: Lightweight and rule-based for this prototype.
* No voice input: Currently lacks real-time speech recognition.

---

## Rate Limiting

This project uses [Upstash Redis](https://upstash.com/) to protect AI-powered endpoints from abuse via a distributed sliding window rate limiter.

### Protected Endpoints

| Endpoint | Limit |
|---|---|
| `POST /api/ai-summary` | 10 requests / minute per IP |
| `POST /api/interpret-command` | 10 requests / minute per IP |
| `POST /api/classify-image` | 10 requests / minute per IP |

> All three endpoints share a combined rate limit counter per IP. A single client is capped at 10 requests per minute across all endpoints.

### Implementation

Rate limiting is handled by [`@upstash/ratelimit`](https://github.com/upstash/ratelimit) using a **sliding window** algorithm. When a limit is exceeded, the API returns a `429 Too Many Requests` response with a `Retry-After` header indicating when the client may retry.
```json
{
  "error": "Too many requests. Try again in 42s."
}
```

### Configuration

Install the required packages:
```bash
npm install @upstash/ratelimit @upstash/redis
```

Add the following environment variables to your `.env.local`:
```env
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token
```

> You can obtain these credentials from the **Details** tab of your database on the [Upstash dashboard](https://console.upstash.com/).

---

## Next Steps & Improvements
* Add a true idle animation state.
* Introduce object-aware interactions.
* Support chained commands (“Walk forward and wave”).
* Add voice-based control.
* Integrate real asset data (e.g. maintenance or training metadata).
* Expand environments beyond a single avatar scene.
