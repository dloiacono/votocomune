package it.comunali.auth;

import io.smallrye.jwt.build.Jwt;
import io.smallrye.jwt.build.JwtException;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.Set;

@ApplicationScoped
public class JwtUtils {

    private static final long EXPIRATION_TIME_SECONDS = 8 * 3600; // 8 hours

    public String generateToken(String username, Set<String> profili) throws JwtException {
        return Jwt.subject(username)
                .upn(username)
                .groups(profili)
                .expiresIn(EXPIRATION_TIME_SECONDS)
                .issuer("https://comunali.app")
                .sign();
    }
}
