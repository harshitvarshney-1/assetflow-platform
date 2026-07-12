package com.assetflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class AssetFlowApplication {
    public static void main(String[] args) {
        SpringApplication.run(AssetFlowApplication.class, args);
    }
}
