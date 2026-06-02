package com.proiect.tpd.CodeAssist.service.languageDetection;

import org.springframework.stereotype.Service;

@Service
public class LanguageResolutionService {

    public String resolve(String detected, String override)
    {
        if(override != null && !override.isBlank())
        {
            return override;
        }
        return detected;
    }
}
