# MindMile - Location-Based Reminder App

![MindMile App Screenshot](screenshots/app-preview.png) <!-- Add your screenshot if available -->

A React Native (non-Expo) application that triggers reminders when you arrive at specified locations.

## Table of Contents
- [MindMile - Location-Based Reminder App](#mindmile---location-based-reminder-app)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
    - [Core Functionality](#core-functionality)
    - [Technical Highlights](#technical-highlights)
  - [Demo](#demo)
  - [Tech Stack](#tech-stack)
    - [Core Dependencies](#core-dependencies)
    - [Navigation](#navigation)
    - [Utilities](#utilities)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Setup Steps](#setup-steps)

## Features

### Core Functionality
- 📍 Set location-based reminders using map or address search
- 🔔 Receive push notifications when arriving at locations
- ⏰ Optional time-based reminders
- 📋 View and manage all reminders in one place

### Technical Highlights
- 🚀 Background geolocation tracking
- 📱 Works in minimized/background state
- 🔄 Real-time distance calculation
- 🔒 Secure local storage of reminders

## Demo

[![Demo Video](https://img.youtube.com/vi/YOUR_VIDEO_ID/0.jpg)](https://youtu.be/YOUR_VIDEO_ID)

## Tech Stack

### Core Dependencies
| Package                          | Version | Purpose           |
| -------------------------------- | ------- | ----------------- |
| react-native                     | 0.72+   | Core framework    |
| typescript                       | ^4.9.5  | Type checking     |
| react-native-maps                | ^1.7.1  | Map integration   |
| react-native-geolocation-service | ^5.3.1  | Location tracking |
| @notifee/react-native            | ^7.7.1  | Notifications     |

### Navigation
| Package                        | Purpose          |
| ------------------------------ | ---------------- |
| @react-navigation/native       | Routing core     |
| @react-navigation/native-stack | Stack navigation |

### Utilities
| Package                                   | Purpose                |
| ----------------------------------------- | ---------------------- |
| react-native-geocoding                    | Address ↔ coordinates  |
| @react-native-async-storage/async-storage | Local data persistence |

## Installation

### Prerequisites
- Node.js 18+
- npm 9+ or yarn 1.22+
- Java JDK 11
- Android Studio (for Android)
- Xcode 15+ (for iOS)

### Setup Steps
1. Clone repository:
   ```bash
   git clone https://github.com/yourusername/mindmile.git
   cd mindmile
