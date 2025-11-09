package com.patuljci.gearshare;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@SpringBootApplication
@EnableWebSecurity
public class GearShareApplication {

	public static void main(String[] args) {

        //System.out.println(spring.application.name);

        SpringApplication.run(GearShareApplication.class, args);
	}


}
