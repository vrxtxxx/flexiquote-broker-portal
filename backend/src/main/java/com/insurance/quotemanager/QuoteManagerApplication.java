
package com.insurance.quotemanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class QuoteManagerApplication {
    public static void main(String[] args) {
        SpringApplication.run(QuoteManagerApplication.class, args);
    }
}
