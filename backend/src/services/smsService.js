import { config } from '../config/env.js';
import { Notification } from '../models/Notification.js';

let client = null;
if (config.twilioAccountSid && config.twilioAuthToken) {
  try {
    const twilioModule = await import('twilio');
    const twilio = twilioModule.default || twilioModule;
    client = twilio(config.twilioAccountSid, config.twilioAuthToken);
  } catch (e) {
    console.log('ℹ️ Twilio module not installed - SMS fallback logger mode active');
  }
}

export const smsTemplates = {
  booking_confirmation: {
    hi: (data) =>
      `कृषि कतार: आपका टोकन #${data.tokenNumber} ${data.centreName} के लिए ${data.date} (${data.timeSlot}) पर बुक किया गया है। फसल: ${data.cropType}।`,
    en: (data) =>
      `AgriQueue: Your slot token #${data.tokenNumber} at ${data.centreName} is confirmed for ${data.date} (${data.timeSlot}). Crop: ${data.cropType}.`,
    gu: (data) =>
      `એગ્રીક્યુ: તમારું ટોકન #${data.tokenNumber} ${data.centreName} ખાતે ${data.date} માટે કન્ફર્મ થયું છે.`,
  },
  turn_alert: {
    hi: (data) =>
      `कृषि कतार: अलर्ट! टोकन #${data.tokenNumber} की बारी आ गई है। कृपया वजन काउंटर 1 पर तुरंत पहुंचें।`,
    en: (data) =>
      `AgriQueue: ALERT! Token #${data.tokenNumber} is NOW SERVING at ${data.centreName}. Please report immediately to Weighment Counter 1.`,
  },
  payment_disbursed: {
    hi: (data) =>
      `कृषि कतार: बधाई हो! ₹${data.amount} का भुगतान आपके बैंक खाते ${data.bankAccount} में क्रेडिट कर दिया गया है। संदर्भ: ${data.txnRef}`,
    en: (data) =>
      `AgriQueue: Payment of Rs.${data.amount} has been successfully disbursed via DBT to bank A/C ${data.bankAccount}. Ref: ${data.txnRef}.`,
  },
};

export const sendSMS = async ({ toPhone, message, lang = 'hi', templateKey, templateData, userId = null }) => {
  let smsContent = message;

  if (!smsContent && templateKey && smsTemplates[templateKey]) {
    const langFn = smsTemplates[templateKey][lang] || smsTemplates[templateKey]['en'];
    smsContent = langFn(templateData);
  }

  console.log(`\n========================================`);
  console.log(`📱 [SMS DISPATCH] To: ${toPhone} (${lang.toUpperCase()})`);
  console.log(`💬 Message: ${smsContent}`);
  console.log(`========================================\n`);

  let status = 'sent';

  if (client && config.twilioPhoneNumber) {
    try {
      await client.messages.create({
        body: smsContent,
        from: config.twilioPhoneNumber,
        to: toPhone.startsWith('+91') ? toPhone : `+91${toPhone}`,
      });
      console.log(`✅ Twilio SMS dispatched to ${toPhone}`);
    } catch (err) {
      console.error(`⚠️ Twilio SMS delivery failed: ${err.message}`);
      status = 'failed';
    }
  }

  if (userId) {
    try {
      await Notification.create({
        userId,
        type: 'SMS',
        message: smsContent,
        status,
      });
    } catch (err) {
      console.error('Error logging notification:', err.message);
    }
  }

  return { success: true, message: smsContent };
};
