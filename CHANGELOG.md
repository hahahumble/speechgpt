# 📝 Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.5.1] - 2023-05-15
### 🛠️ Changed
- Retain disable speaker and disable microphone states after refresh
- Disable send button when the input is empty
- Hide record button when the microphone is disabled
- Hide replay button when the speaker is disabled
- Reset conversation confirmation

### 🐞 Fixed
- Reset confirmation disappear problem

## [0.5.0] - 2023-05-12
### 🛠️ Changed
- Brand-new UI design
- New about page design
- New color theme
- New icon library

### ✨ Added
- Allow to change conversation color
- Allow to clear all conversations
- Delete requires confirmations

### 🐞 Fixed
- Delete multiple conversations at once error

## [0.4.3] - 2023-04-26
### 🛠️ Changed
- Improve website SEO
- Update `README.md`

### ✨ Added
- Add developer guide

### 🐞 Fixed
- Typo in the settings page

## [0.4.2] - 2023-04-22
### 🛠️ Changed
- Update settings about page link icons
- Improve the stability of the Azure speech synthesis service
- i18n of the input panel

## [0.4.1] - 2023-04-19

### ✨ Added
- Allow user to set access code to protect the app (#61) 
- Add change log

## [0.4.0] - 2023-04-17
### ✨ Added
- Support multiple conversions
- Allow to change OpenAI model

### 🐞 Fixed
- Hide button when text is selected

## [0.3.0] - 2023-04-10
### ✨ Added
- Add replay button
- Supports saving chat records locally

### 🐞 Fixed
- Hide keyboard on mobile when user send a message
- Fix bug when using environment variables to set OpenAI Key
- Cannot delete message error
