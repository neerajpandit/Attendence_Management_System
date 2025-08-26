import { fileURLToPath } from "url";
import path from "path";
import { log } from "console";

// Convert ES module URL to file path
export const __filename = fileURLToPath(import.meta.url);

// Directory of the current file (e.g., src/config)
const __dirnames = path.dirname(__filename);

// Root directory of the project (goes 2 levels up from config/)
export const __dirname = path.resolve(__dirnames, "../../");
log("Project Root (__dirname):", __dirname);

// DB settings
export const DB_NAME = "LeaveManagementSystem";

// Express body parser limits
export const EXPRESS_JSON_LIMIT = "50mb";
export const EXPRESS_URLENCODED_LIMIT = "50mb";

// Upload directories (under <project-root>/public)
export const UPLOAD_DIR = path.join(__dirname, "public/uploads");
export const UPLOAD_DIR_IMAGES = path.join(UPLOAD_DIR, "images");
export const UPLOAD_DIR_LOGS = path.join(__dirname, "public"); // Optional logs folder under public/logs

// Rate limiting
export const RATE_LIMIT_WINDOW_MS = 1 * 60 * 1000; // 1 hour
export const RATE_LIMIT_MAX_REQUESTS = 100000000000000;
export const RATE_LIMIT_MESSAGE = "Too many requests, please try again later.";
