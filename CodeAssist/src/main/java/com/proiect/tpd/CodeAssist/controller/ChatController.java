package com.proiect.tpd.CodeAssist.controller;

import com.proiect.tpd.CodeAssist.dto.ChatRequestDto;
import com.proiect.tpd.CodeAssist.dto.ChatResponseDto;
import com.proiect.tpd.CodeAssist.service.ChatService;
import lombok.RequiredArgsConstructor;

import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatResponseDto> chat(
            @Valid @RequestBody ChatRequestDto request
    ) {
        return ResponseEntity.ok(chatService.chat(request));
    }
}
