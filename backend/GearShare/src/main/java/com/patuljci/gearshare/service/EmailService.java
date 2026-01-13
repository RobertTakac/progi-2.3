package com.patuljci.gearshare.service;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final SendGrid sendGrid;
    private final String fromEmail;

    public EmailService(@Value("${SENDGRID_API_KEY}") String apiKey,
                        @Value("${SUPPORT_EMAIL}") String fromEmail) {
        this.sendGrid = new SendGrid(apiKey);
        this.fromEmail = fromEmail;
    }

    public void sendVerificationEmail(String to, String subject, String htmlMessage) {
        Email from = new Email(fromEmail);
        Email toEmail = new Email(to);
        Content content = new Content("text/html", htmlMessage);
        Mail mail = new Mail(from, subject, toEmail, content);

        mail.setReplyTo(new Email("gearshare8@gmail.com"));

        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sendGrid.api(request);
            System.out.println("SendGrid response code: " + response.getStatusCode());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }
}
