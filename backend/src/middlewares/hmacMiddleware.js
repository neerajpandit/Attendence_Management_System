
import crypto from 'crypto';

export const generateHmac = (message, secretKey, algorithm = 'sha256') => {
  if (!message || !secretKey) {
    throw new Error('Message and secret key are required for HMAC generation.');
  }
  
  return crypto.createHmac(algorithm, secretKey)
               .update(message)
               .digest('hex');
};


export const verifyHmac = (message, secretKey, providedHmac, algorithm = 'sha256') => {
  if (!message || !secretKey || !providedHmac) {
    throw new Error('Message, secret key, and HMAC are required for verification.');
  }

  const generatedHmac = generateHmac(message, secretKey, algorithm);

  // Timing-safe comparison to prevent timing attacks
  return crypto.timingSafeEqual(Buffer.from(generatedHmac), Buffer.from(providedHmac));
};




const secretKey = process.env.HMAC_SECRET_KEY || 'supersecretkey123';

export const hmacMiddleware = (req, res, next) => {
  try {
    console.log("Start Hamc");
    
    const signature = req.headers['x-signature']; // Signature from the header
    if (!signature) {
      console.warn('Signature not found.');
      return res.status(403).json({ error: 'Signature not found in headers.' });
    }

    const message = JSON.stringify(req.body); // Convert body to string for verification

    // Verify HMAC
    if (!verifyHmac(message, secretKey, signature)) {
      console.warn(`HMAC verification failed for message: ${message}`);
      return res.status(403).json({ error: 'Unauthorized: HMAC verification failed.' });
    }

    next();
  } catch (error) {
    console.error('HMAC Middleware Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
