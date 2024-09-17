# Flightwatch (WIP)

FlightWatch is a modern, Vue.js-based alternative for the excellent [tar1090](https://github.com/wiedehopf/tar1090]) package. It provides a real-time, user-friendly interface for monitoring and visualizing ADS-B data.

This is a work in progress and is not yet ready for production use. Currently data is pulled from [adsb.lol](https://adsb.lol) public api. In the future the plan is to support readsb / dump1090-fa and other data sources.

![FlightWatch Screenshot](/flightwatch.png)

## Table of Contents
- [Features](#features)
- [Demo](#demo)
- [Roadmap](#roadmap)
- [Installation](#installation)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)

## Features
- Real-time ADS-B data visualization with data from [adsb.lol](https://adsb.lol)
- sidebar with detailed information about each aircraft
- Aircraft images from [planespotters.net](https://www.planespotters.net)
- Flight information from [virtualradarserver.co.uk](https://www.virtualradarserver.co.uk)

## Demo
A live demo is not currently available. Please see the [Installation](#installation) section for instructions on how to run FlightWatch on your own server.

## Roadmap
- [ ] Airline Logos
- [ ] Manufacturer Logos
- [ ] Support for readsb / dump1090-fa
- [ ] Support for other data sources
- [ ] More detailed aircraft information
- [ ] Detailed Schedule information
- [ ] Takeoff / Landing times

## Installation

### Prerequisites
 - Node.js (v18 or higher)
 - NPM

### Instructions

#### 1. Clone the repository
```bash
git clone https://github.com/flashmatt/flightwatch.git
cd flightwatch
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Build the project
- For development
```bash
npm run dev
```
Open your browser and navigate to http://localhost:5173 (default Vite port) to see FlightWatch in action.

- For production
```bash
npm run build
```

## Contributing
Contributions are welcome! Please fork the project, create a feature branch and submit a pull request.

### Acknowledgements
None of this would be possible without the following projects:
- [tar1090](https://github.com/wiedehopf/tar1090])
- [adsb.lol](https://adsb.lol)
- [planespotters.net](https://www.planespotters.net)
- [virtualradarserver.co.uk](https://www.virtualradarserver.co.uk)

## Support

If you find FlightWatch useful, consider giving it a ⭐️ on [GitHub](https://github.com/mattdavis/flightwatch)



