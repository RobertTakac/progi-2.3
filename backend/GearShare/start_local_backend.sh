#!/bin/bash

export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/gearshare_db
export SPRING_DATASOURCE_USERNAME=admin
export SPRING_DATASOURCE_PASSWORD=13!37

export JWT_SECRET_KEY=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970

export SPRING_MAIL_HOST=localhost
export SPRING_MAIL_PORT=1025
export SPRING_MAIL_USERNAME=dummy
export SPRING_MAIL_PASSWORD=dummy
export SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH=false
export SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE=false
export SPRING_MAIL_FROM=noreply@gearshare.local

export GOOGLE_CLIENT_ID=dummy-client-id
export GOOGLE_CLIENT_SECRET=dummy-client-secret

export SENDGRID_API_KEY=SG.dummy_key_to_satisfy_startup_requirements
export SUPPORT_EMAIL=noreply@gearshare.local

./mvnw spring-boot:run
