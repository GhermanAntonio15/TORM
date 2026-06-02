package com.proiect.tpd.CodeAssist.service;

import com.proiect.tpd.CodeAssist.model.ReviewFocus;
import org.springframework.stereotype.Service;

import java.util.EnumSet;
import java.util.stream.Collectors;

@Service
public class PromtBuilderService {

    public String buildFocusSection(EnumSet<ReviewFocus> focusSet)
    {
        return focusSet.stream()
                .map(this::toPromtText)
                .collect(Collectors.joining("\n- ",", ",""));
    }

    private String toPromtText(ReviewFocus focus)
    {
        return switch (focus) {
            case BUGS -> "potential bugs";
            case CODE_SMELLS -> "code smells and maintainability issues";
            case PERFORMANCE -> "performance optimizations";
            case SECURITY -> "security vulnerabilities";
            case READABILITY -> "easy to read and understand logic";
            case CODE_QUALITY -> "good quality, easy to extend";
            default -> "";
        };
    }
}
