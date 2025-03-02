const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

exports.checkDeadlines = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  const db = admin.database();
  const tasksSnapshot = await db.ref('tasks').once('value');
  const tasks = tasksSnapshot.val();

  for (const [taskId, task] of Object.entries(tasks)) {
    const deadline = new Date(task.deadline);
    const today = new Date();
    const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

    if (diffDays <= 3 && diffDays > 0) {
      // Kirim email
      const userSnapshot = await admin.auth().getUser(task.userId);
      const userEmail = userSnapshot.email;
      
      await sendEmail(userEmail, {
        subject: `Deadline Tugas: ${task.title}`,
        text: `Tugas ${task.title} akan berakhir dalam ${diffDays} hari`
      });
    }
  }
});

async function sendEmail(to, { subject, text }) {
  const transporter = nodemailer.createTransport({
    // Konfigurasi email service Anda
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-app-password'
    }
  });

  await transporter.sendMail({
    from: 'your-email@gmail.com',
    to,
    subject,
    text
  });
} 