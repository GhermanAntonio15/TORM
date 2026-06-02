package com.proiect.tpd.CodeAssist.service;

import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class ModelValidationService {
    private static final Set<String> ALLOWED_MODELS = Set.of(
            "codegemma:2b",
            "gemma3:1b"
    );

    public void validate(String model) {
        if (!ALLOWED_MODELS.contains(model)) {
            throw new IllegalArgumentException("Unsupported AI model: " + model);
        }
    }
}
