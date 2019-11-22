package com.goaleaf;


import com.goaleaf.security.uploadingFiles.FileStorageProperties;
import com.goaleaf.services.CommentService;
import com.goaleaf.services.MemberService;
import com.goaleaf.services.NotificationService;
import com.goaleaf.services.PostService;
import com.goaleaf.services.servicesImpl.CommentServiceImpl;
import com.goaleaf.services.servicesImpl.MemberServiceImpl;
import com.goaleaf.services.servicesImpl.NotificationServiceImpl;
import com.goaleaf.services.servicesImpl.PostServiceImpl;
import com.goaleaf.validators.UserCredentialsValidator;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.Arrays;


@EnableJpaRepositories("com.goaleaf.repositories")
@EnableSwagger2
@EnableConfigurationProperties({
        FileStorageProperties.class
})
@SpringBootApplication
public class GoaLeafApplication extends SpringBootServletInitializer {
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(GoaLeafApplication.class);
    }


    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserCredentialsValidator userCredentialsValidator() {
        return new UserCredentialsValidator();
    }

    @Bean
    public MemberService memberService() {
        return new MemberServiceImpl();
    }

    @Bean
    public NotificationService notificationService() {
        return new NotificationServiceImpl();
    }

    @Bean
    public PostService postService() {
        return new PostServiceImpl();
    }

    @Bean
    public CommentService commentService() {
        return new CommentServiceImpl();
    }

    @Bean
    public Docket productApi() {
        return new Docket(DocumentationType.SWAGGER_2)
                .select().apis(RequestHandlerSelectors.basePackage("com.goaleaf.controllers"))
                .build();
    }

//    @Bean
//    public WebMvcConfigurer corsConfigurer() {
//        return new WebMvcConfigurerAdapter() {
//            @Override
//            public void addCorsMappings(CorsRegistry registry) {
//                registry.addMapping("/api/users/edit").allowedOrigins("http://localhost:3000").allowedHeaders("http://localhost:3000").exposedHeaders("Authorization");
//            }
//        };
//    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "DELETE", "PUT", "OPTIONS"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }


    public static void main(String[] args) throws Exception {
        ExceptionHandler exceptionHandler = new ExceptionHandler();
        Thread.setDefaultUncaughtExceptionHandler(exceptionHandler);
//        ObjectMapper objectMapper = new ObjectMapper();
//        objectMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);

        SpringApplication.run(GoaLeafApplication.class, args);
    }

}
