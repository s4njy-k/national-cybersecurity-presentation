# National Cybersecurity Strategy Presentation

A real-time presentation web app summarizing the "Guide for developing a National Cybersecurity Strategy."

## Local Development (Real-Time Mode)

To run the application locally with full Presenter/Viewer synchronization:
1. Clone this repository.
2. `npm install`
3. `PORT=5000 node server.js`
4. Open the Viewer at [http://localhost:5000/](http://localhost:5000/)
5. Open the Presenter Dashboard at [http://localhost:5000/presenter?secret=admin](http://localhost:5000/presenter?secret=admin)

## GitHub Pages (Static Mode)

When hosted on GitHub Pages, the Node.js server cannot run. The application automatically falls back to **Static Mode**. You can click through the slides using your keyboard `Space`, `ArrowRight`, and `ArrowLeft` keys.
