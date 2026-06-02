package com.proiect.tpd.CodeAssist.service;

import com.proiect.tpd.CodeAssist.dto.CodeGenerationRequestDto;
import com.proiect.tpd.CodeAssist.model.AIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CodeGenerationService {

    private final AICodeGenerationService aiCodeGenerationService;

    public AIResponse generate(CodeGenerationRequestDto codeGenerationRequest)
    {
        return aiCodeGenerationService.generate(codeGenerationRequest);
    }
}
