package com.proiect.tpd.CodeAssist.controller;

import com.proiect.tpd.CodeAssist.dto.CodeGenerationRequestDto;
import com.proiect.tpd.CodeAssist.model.AIResponse;
import com.proiect.tpd.CodeAssist.service.CodeGenerationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/generate")
@RequiredArgsConstructor
public class CodeGenerationController {

    private final CodeGenerationService codeGenerationService;

    @PostMapping("/generateUI")
    public ResponseEntity<AIResponse> generate(
            @Valid @RequestBody CodeGenerationRequestDto request
            )
    {
        return  ResponseEntity.ok(
                codeGenerationService.generate(request)
        );
    }
}
