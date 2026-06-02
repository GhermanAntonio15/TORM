package com.proiect.tpd.CodeAssist.controller;

import com.proiect.tpd.CodeAssist.dto.AnalysisResultDto;
import com.proiect.tpd.CodeAssist.dto.CodeFileUploadDto;
import com.proiect.tpd.CodeAssist.dto.ReviewFocusDto;
import com.proiect.tpd.CodeAssist.model.agent.AgentRequest;
import com.proiect.tpd.CodeAssist.model.CodeFile;
import com.proiect.tpd.CodeAssist.model.agent.AgentResponse;
import com.proiect.tpd.CodeAssist.service.reviewServices.CodeReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Set;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
public class CodeReviewController {

    private final CodeReviewService codeReviewService;

    @PostMapping("/codeReview")
    public ResponseEntity<AnalysisResultDto> aiReview(
            @Valid @ModelAttribute CodeFileUploadDto fileDto,
            @RequestParam String model,
            @RequestParam(required = false) Set<String> focus
    ) {
        ReviewFocusDto focusDto = new ReviewFocusDto();
        focusDto.setFocus(focus);

        return ResponseEntity.ok(
                codeReviewService.review(fileDto, model, focusDto)
        );
    }

    @PostMapping("/upload")
    public ResponseEntity<CodeFile> uploadCode(
            @Valid @ModelAttribute CodeFileUploadDto request
    ) {
        CodeFile saved = codeReviewService.saveCodeFile(request);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/analyze")
    public ResponseEntity<AgentResponse> analyze(
            @Valid @RequestBody AgentRequest request
    ) {
        return ResponseEntity.ok(
                codeReviewService.analyze(request)
        );
    }

}

