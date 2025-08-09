
import { json } from '@sveltejs/kit';

const RESEND_API_KEY = 're_NQ9f4R1P_MdyxioTRhSVEs5dxvrxfjgMu'; // info mail
// const RESEND_API_KEY="re_26VudLLE_2N8do7voUM6RUHPaBh7RxLE9" hr mail
// @ts-ignore
export async function POST({ request }) {
    try {
      const payload = await request.json();
      const { name, mobile, email, interestedServices, message } = payload;
  
      const emailHtml = `
        <h2>New Consultation Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Mobile:</strong> ${mobile}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Interested Services:</strong> ${interestedServices}</p>
        <p><strong>Message:</strong> ${message || 'N/A'}</p>
      `;
  
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Creoleap Consultation Form <onboarding@resend.dev>',
          to: ['info@creoleap.com'],
          subject: `Consultation Request from ${name}`,
          html: emailHtml,
        }),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Resend API error: ${errorData.error || res.statusText}`);
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