// backupDatabase.js
import { exec } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const BACKUP_DIR = path.resolve(process.env.BACKUP_DIR || './mongodb_backups');
const MONGO_URI = process.env.MONGO_URI;
const MAX_BACKUPS = parseInt(process.env.MAX_BACKUPS) || 7;

// Ensure backup directory exists
fs.ensureDirSync(BACKUP_DIR);

// Generate timestamped folder name
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}.gz`);

// Function to create the backup
const createBackup = () => {
  console.log(`Starting full database backup: ${backupPath}`);
  const command = `mongodump --uri="${MONGO_URI}" --archive="${backupPath}" --gzip`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Backup failed: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`Backup completed successfully at ${backupPath}`);
    cleanOldBackups();
  });
};

// Function to clean up old backups
const cleanOldBackups = async () => {
  const files = await fs.readdir(BACKUP_DIR);

  // Filter and sort by creation date
  const backupFiles = files
    .filter(file => file.endsWith('.gz'))
    .sort((a, b) => {
      return (
        fs.statSync(path.join(BACKUP_DIR, a)).mtimeMs -
        fs.statSync(path.join(BACKUP_DIR, b)).mtimeMs
      );
    });

  // Remove the oldest if backups exceed the limit
  if (backupFiles.length > MAX_BACKUPS) {
    const filesToDelete = backupFiles.slice(0, backupFiles.length - MAX_BACKUPS);
    for (const file of filesToDelete) {
      await fs.remove(path.join(BACKUP_DIR, file));
      console.log(`Old backup removed: ${file}`);
    }
  }
};

// Run the backup
createBackup();
