# Max Escape Creation (MEC)

A Warcraft III ingame escape editor enabling players to save modifications directly in the map.

**Website:** https://mec.maxslid.com/  
**Discord Community:** http://discord.gg/N8QwwFTcYJ

## Introduction

Max Escape Creation is a project by Maxiglider that provides an ingame escape editor for Warcraft III. Originally developed during Murloc Slide development (2008) to streamline monster creation, MEC has evolved into a comprehensive map editing solution.

In 2022, Stan joined the project, bringing MEC 2 with new features for Warcraft III Reforged. Players on older Warcraft III versions can use the legacy MEC version.

## Project Structure

### `TS/` - Active Development

**All active maps are in the TS folder.** This contains the modern TypeScript-based implementation of MEC.

- **Testing:** Run `yarn test` to test the project
- **Release:** Run `yarn release` to generate the `final-we.lua` used to distribute new core versions

### `core/` - Legacy Jass Code

Contains the original Jass code from MEC1. This is the historical codebase that has been superseded by the TypeScript implementation.

## Development

We primarily work on the **master branch**.

## Changelog

The active changelog is maintained on our **Discord server**. Join us at http://discord.gg/N8QwwFTcYJ for the latest updates and community discussions.

## Getting Started

1. Clone the repository
2. Navigate to the `TS/` folder
3. Install dependencies: `yarn install`
4. Run tests: `yarn test`

---

_For questions, support, or to join the community, visit our Discord server._
