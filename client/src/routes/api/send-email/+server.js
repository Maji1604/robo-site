
import { json } from '@sveltejs/kit';

const RESEND_API_KEY = 're_NQ9f4R1P_MdyxioTRhSVEs5dxvrxfjgMu'; // Your Resend API key

// @ts-ignore
export async function POST({ request }) {
  try {
    const payload = await request.json();
    const {
      firstName,
      lastName,
      mobile,
      email,
      education,
      message,
      resumeBase64,
    } = payload;

    const emailHtml = `
      <h2>New Job Application</h2>
      <p><strong>First Name:</strong> ${firstName}</p>
      <p><strong>Last Name:</strong> ${lastName}</p>
      <p><strong>Mobile:</strong> ${mobile}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Education:</strong> ${education}</p>
      <p><strong>Message:</strong> ${message}</p>
      <p>See attached resume below.</p>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Creoleap Careers <onboarding@resend.dev>',
        to: ['info@creoleap.com'],
        subject: `Job Application from ${firstName} ${lastName}`,
        html: emailHtml,
        attachments: [
          {
            filename: `${firstName}_${lastName}_resume.pdf`,
            content: resumeBase64, // Base64-encoded PDF
            type: 'application/pdf',
          },
        ],
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`Resend API error: ${errorData.message || res.statusText}`);
    }

    const data = await res.json();
    return json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}