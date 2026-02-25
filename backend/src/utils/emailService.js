import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("Email credentials not found in env. Email not sent.");
      return;
    }

    const mailOptions = {
      from: `"HomeFix Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    // Don't throw error to prevent blocking the main flow if email fails
  }
};

export const sendWelcomeEmail = async (userEmail, userName, role) => {
  const subject = "Welcome to HomeFix!";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #4CAF50;">Welcome to HomeFix, ${userName}!</h2>
      <p>Thank you for joining our platform as a <strong>${role}</strong>.</p>
      <p>We are excited to have you with us. Whether you're looking for professional help or offering your services, HomeFix is here to make things easier for you.</p>
      <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-left: 5px solid #4CAF50;">
        <p style="margin: 0;"><strong>What's next?</strong></p>
        <p style="margin: 5px 0 0;">Log in to your account and complete your profile to get the most out of HomeFix.</p>
      </div>
      <p>If you have any questions, feel free to reply to this email.</p>
      <p>Best Regards,<br/>The HomeFix Team</p>
    </div>
  `;
  return sendEmail(userEmail, subject, html);
};

export const sendTechnicianStatusEmail = async (userEmail, userName, status, rejectionReason = "") => {
  const isApproved = status === "APPROVED";
  const subject = isApproved 
    ? "Your Technician Account is Approved! - HomeFix" 
    : "Update on your HomeFix Technician Application";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: ${isApproved ? "#4CAF50" : "#F44336"};">
        ${isApproved ? "Congratulations, " + userName + "!" : "Application Status Update"}
      </h2>
      <p>Dear ${userName},</p>
      <p>
        ${isApproved 
          ? "Your application to join HomeFix as a technician has been <strong>APPROVED</strong>. You can now log in and start accepting jobs." 
          : "We verified your application but unfortunately, we cannot approve it at this time."}
      </p>
      
      ${!isApproved ? `
        <div style="background-color: #fff0f0; padding: 15px; border-left: 5px solid #F44336; margin: 20px 0;">
          <strong>Reason for Rejection:</strong><br/>
          ${rejectionReason || "Documents provided were insufficient or invalid."}
        </div>
      ` : ""}

      <div style="margin-top: 20px;">
        <a href="http://localhost:5173/auth" style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px;">
          ${isApproved ? "Login Now" : "Review Details"}
        </a>
      </div>
      
      <p style="margin-top: 20px;">If you have any questions, feel free to reply to this email.</p>
      <p>Best Regards,<br/>The HomeFix Team</p>
    </div>
  `;
  return sendEmail(userEmail, subject, html);
};
