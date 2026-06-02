package com.proiect.tpd.CodeAssist.service.languageDetection;

import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class LanguageDetectionService {

    private static final Map<String,String> EXTENSION_TO_LANGUAGE = Map.ofEntries(
            Map.entry("java", "java"),
            Map.entry("js", "JavaScript"),
            Map.entry("ts", "TypeScript"),
            Map.entry("py", "Python"),
            Map.entry("cpp", "C++"),
            Map.entry("cs", "C#"),
            Map.entry("c", "C"),
            Map.entry("html", "HTML"),
            Map.entry("css", "CSS")
    );

    public String detect(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "Unknown";
        }
        String ext = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
        return EXTENSION_TO_LANGUAGE.getOrDefault(ext, "Unknown");
    }
}
