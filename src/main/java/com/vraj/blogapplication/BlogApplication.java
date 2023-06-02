package com.vraj.blogapplication;

import com.vraj.blogapplication.models.entities.Category;
import com.vraj.blogapplication.repositories.interfaces.CategoryRepository;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@SpringBootApplication
@OpenAPIDefinition(
        info = @Info(
                title = "Blog Application",
                version = "1.0",
                contact = @Contact(
                        name = "Vraj Shah",
                        email = "vrajshah363@gmail.com",
                        url = "https://vraj-shah.me"
                )
        )
)
@EnableJpaAuditing
public class BlogApplication implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    public static void main(String[] args) {
        log.info("Application is running...");
        SpringApplication.run(BlogApplication.class, args);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    public void seedCategories() {
        try {
            List<Category> categories = new ArrayList<>();
            categories.add(Category.builder().name("Technology").build());
            categories.add(Category.builder().name("Health").build());
            categories.add(Category.builder().name("Development").build());
            categories.add(Category.builder().name("Education").build());
            categories.add(Category.builder().name("Other").build());
            categoryRepository.saveAll(categories);
        } catch (Exception exception) {
            log.error(exception.toString());
        }
    }

    @Override
    public void run(String... args) throws Exception {
        seedCategories();
    }

}
