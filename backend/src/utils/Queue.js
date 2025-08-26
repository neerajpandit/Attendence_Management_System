// queue.js
import { Queue } from 'bullmq';
import * as dotenv from 'dotenv';
dotenv.config();

const emailQueue = new Queue('emailQueue', {
  connection: {
    host: '127.0.0.1',
    port: 6379,
  },
  defaultJobOptions: {
    attempts: 3,             // Maximum retry attempts
    backoff: {
      type: 'exponential',   // Exponential delay (2s, 4s, 8s, etc.)
      delay: 2000            // Start with a 2-second delay
    },
    removeOnComplete: true,  // Remove job after successful completion
    removeOnFail: false      // Keep failed jobs for logging
  },
});

export default emailQueue;


// 2nd file

// mailer.js
import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendMail = async (to, subject, text) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    text,
  });
};

//3rd file 
// emailProcessor.js
import { Worker } from 'bullmq';
import { sendMail } from './mailer.js';
import * as dotenv from 'dotenv';
dotenv.config();

const emailWorker = new Worker(
  'emailQueue',
  async job => {
    const { to, subject, text } = job.data;

    console.log(`Attempting to send email to ${to}`);
    
    try {
      await sendMail(to, subject, text);
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error(`Failed to send email to ${to}: ${error.message}`);
      throw new Error(error.message);  // This triggers the retry mechanism
    }
  },
  {
    connection: {
      host: '127.0.0.1',
      port: 6379,
    },
  }
);

// Event listener for failed jobs
emailWorker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed after ${job.attemptsMade} attempts`);
  console.error(`Error: ${err.message}`);
});

emailWorker.on('completed', job => {
  console.log(`Job ${job.id} completed successfully.`);
});


//4th file
app.post('/send-email', async (req, res) => {
    const { to, subject, text } = req.body;
  
    try {
      await emailQueue.add('sendEmail', { to, subject, text });
      res.status(200).json({ message: 'Email job added to queue' });
    } catch (error) {
      res.status(500).json({ message: 'Error adding email to queue', error });
    }
  });