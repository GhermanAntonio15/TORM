package com.proiect.tpd.CodeAssist.service.reviewServices;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.proiect.tpd.CodeAssist.dto.AnalysisResultDto;
import com.proiect.tpd.CodeAssist.model.AIResponse;
import com.proiect.tpd.CodeAssist.model.CodeFile;
import com.proiect.tpd.CodeAssist.model.ReviewFocus;
import com.proiect.tpd.CodeAssist.repository.AIResponseRepository;
import com.proiect.tpd.CodeAssist.service.ModelValidationService;
import com.proiect.tpd.CodeAssist.service.PromtBuilderService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.stereotype.Service;

import java.util.EnumSet;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AIReviewService {

    private final ChatClient.Builder chatClientBuilder;
    private final AIResponseRepository aiResponseRepository;
    private final ModelValidationService modelValidationService;
    private final PromtBuilderService promtBuilderService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AnalysisResultDto review(
            CodeFile codeFile,
            String model,
            EnumSet<ReviewFocus> focusSet
    ) {
        modelValidationService.validate(model);

        ChatOptions chatOptions = ChatOptions.builder()
                .model(model)
                .build();

        ChatClient chatClient = chatClientBuilder
                .defaultOptions(chatOptions)
                .build();

        String focusText = promtBuilderService.buildFocusSection(focusSet);

        String prompt = """
            You are a senior software engineer performing a code review.
            
            Respond ONLY with valid JSON.
            Do NOT use markdown.
            Do NOT wrap the response in ```json.
            
            JSON format:
            {
              "scores": number,
              "general": string,
              "issues": [string],
              "suggestions": [string]
            }

            Rules:
            - general: max 150 characters
            - each issue: max 150 characters
            - each suggestion: max 150 characters
            - respond in maxim 10 seconds
            -scores must be between min: 0 max: 100
            
            Focus on:
            %s

            CODE (%s):
            %s
            """.formatted(
                focusText,
                codeFile.getLanguage(),
                codeFile.getContent()
        );

        String rawResult = chatClient.prompt()
                .user(prompt)
                .call()
                .content();

        AnalysisResultDto analysis = parseAiResponse(rawResult);

        AIResponse response = new AIResponse();
        response.setResponse(rawResult);
        response.setType("REVIEW (" + model + ")");
        aiResponseRepository.save(response);

        return analysis;
    }

    /* ================= HELPERS ================= */

    private AnalysisResultDto parseAiResponse(String raw) {
        try {
            String cleaned = cleanJson(raw);
            JsonNode root = objectMapper.readTree(cleaned);

            AnalysisResultDto dto = new AnalysisResultDto();
            dto.setScore(root.path("scores").asInt());
            dto.setSummary(root.path("general").asText());

            dto.setIssues(
                    objectMapper.convertValue(
                            root.path("issues"),
                            objectMapper.getTypeFactory()
                                    .constructCollectionType(List.class, String.class)
                    )
            );

            dto.setSuggestions(
                    objectMapper.convertValue(
                            root.path("suggestions"),
                            objectMapper.getTypeFactory()
                                    .constructCollectionType(List.class, String.class)
                    )
            );

            return dto;

        } catch (Exception e) {
            throw new RuntimeException("Invalid AI JSON response", e);
        }
    }

    private String cleanJson(String raw) {
        return raw
                .replace("```json", "")
                .replace("```", "")
                .trim();
    }
}
