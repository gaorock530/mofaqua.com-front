// web worker
import Worker from '../worker/pic.worker.js';

export default window.Worker?new Worker():null;

