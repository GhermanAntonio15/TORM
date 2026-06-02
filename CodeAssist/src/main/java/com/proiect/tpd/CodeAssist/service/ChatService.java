package com.proiect.tpd.CodeAssist.service;

import com.proiect.tpd.CodeAssist.dto.ChatRequestDto;
import com.proiect.tpd.CodeAssist.dto.ChatResponseDto;
import com.proiect.tpd.CodeAssist.model.ChatMessage;
import com.proiect.tpd.CodeAssist.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatClient.Builder chatClientBuilder;
    private final ChatMessageRepository chatMessageRepository;
    private final ModelValidationService modelValidationService;

    public ChatResponseDto chat(ChatRequestDto request) {

        System.out.println(request.getModel());
        modelValidationService.validate(request.getModel());

        List<ChatMessage> history =
                chatMessageRepository.findBySessionIdOrderByIdAsc(
                        request.getSessionId()
                );

        ChatOptions chatOptions = ChatOptions.builder()
                .model(request.getModel())
                .build();

        ChatClient chatClient = chatClientBuilder
                .defaultOptions(chatOptions)
                .build();

        var  prompt = chatClient.prompt();

        prompt.system("""
          You need to give shorter and more precise answers, stop providing a lot of information, and offer only the essential information. Keep this in mind and use it from now on in our conversation.You need to provide a faster response, in a shorter amount of time.
          i want a small response. For example, if I ask you what C# is, I want you to give me a short answer like this: C# is a modern, object-oriented programming language developed by Microsoft. It is used for Windows, web, desktop, mobile applications, and games, especially on the .NET platform.
        """);

        for (ChatMessage msg : history) {
            if ("USER".equals(msg.getRole())) {
                prompt.user(msg.getContent());
            }
        }

        prompt.user(request.getMessage());

        String aiResponse = prompt.call().content();

        chatMessageRepository.save(
                new ChatMessage(null, "USER", request.getMessage(), request.getSessionId())
        );
        chatMessageRepository.save(
                new ChatMessage(null, "ASSISTANT", aiResponse, request.getSessionId())
        );

        return new ChatResponseDto(aiResponse);
    }
}
