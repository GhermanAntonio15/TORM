package com.proiect.tpd.CodeAssist.service;

import com.proiect.tpd.CodeAssist.dto.CodeGenerationRequestDto;
import com.proiect.tpd.CodeAssist.model.AIResponse;
import com.proiect.tpd.CodeAssist.repository.AIResponseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AICodeGenerationService {

    private final ChatClient.Builder chatClientBuilder;
    private final AIResponseRepository aiResponseRepository;
    private final ModelValidationService modelValidationService;

    public AIResponse generate(CodeGenerationRequestDto request)
    {
      modelValidationService.validate(request.getModel());

      ChatOptions chatOptions = ChatOptions.builder().model(request.getModel()).build();

      ChatClient chatClient = chatClientBuilder
              .defaultOptions(chatOptions).build();

        String prompt = getPrompt(request);

        String result = chatClient
                .prompt()
                .user(prompt)
                .call()
                .content();

        AIResponse response = new AIResponse();
        response.setResponse(result);
        response.setType("GENERATION (" + request.getModel() + ")");

        return aiResponseRepository.save(response);
    }

    private static String getPrompt(CodeGenerationRequestDto request) {
        String target = request.getTarget() != null
                ? request.getTarget()
                : "HTML/CSS/JavaScript";

        String prompt = """
            You are a senior frontend developer.
            Generate clean, readable and responsive %s code.

            Requirements:
            - modern UI
            - responsive layout
            - semantic HTML
            - well structured CSS
            - minimal JavaScript if needed

            DESCRIPTION:
            %s

            Return ONLY the code.
            """.formatted(target, request.getDescription());
        return prompt;
    }

}
