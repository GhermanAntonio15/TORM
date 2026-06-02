package com.proiect.tpd.CodeAssist.service.reviewServices;

import com.proiect.tpd.CodeAssist.dto.AnalysisResultDto;
import com.proiect.tpd.CodeAssist.dto.CodeFileUploadDto;
import com.proiect.tpd.CodeAssist.dto.ReviewFocusDto;
import com.proiect.tpd.CodeAssist.model.AIResponse;
import com.proiect.tpd.CodeAssist.model.CodeFile;
import com.proiect.tpd.CodeAssist.model.ReviewFocus;
import com.proiect.tpd.CodeAssist.model.agent.AgentRequest;
import com.proiect.tpd.CodeAssist.model.agent.AgentResponse;
import com.proiect.tpd.CodeAssist.repository.CodeFileRepository;
import com.proiect.tpd.CodeAssist.service.languageDetection.LanguageDetectionService;
import com.proiect.tpd.CodeAssist.service.languageDetection.LanguageResolutionService;
import com.proiect.tpd.CodeAssist.service.memory.MemoryService;
import com.proiect.tpd.CodeAssist.service.memory.QdrantMemoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.EnumSet;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CodeReviewService {

    private final CodeFileRepository codeFileRepository;
    private final LanguageDetectionService languageDetectionService;
    private final LanguageResolutionService languageResolutionService;
    private final AIReviewService reviewService;
    private final ReviewFocusResolutionService reviewFocusResolutionService;
    private final MemoryService memoryService;

    public AnalysisResultDto review(CodeFileUploadDto fileUpload, String model, ReviewFocusDto reviewFocus)
    {
        String fileName = fileUpload.getFile().getOriginalFilename();
        String detected = languageDetectionService.detect(fileName);
        String fileLanguage = languageResolutionService.resolve(detected, fileUpload.getLanguageOvveride());

        EnumSet<ReviewFocus> focusSet =
                reviewFocusResolutionService.resolve(
                        reviewFocus != null ? reviewFocus.getFocus() : null
                );

        try {
            CodeFile codeFile = new CodeFile();
            codeFile.setFilename(fileName);
            codeFile.setLanguage(fileLanguage);
            codeFile.setContent(
                    new String(fileUpload.getFile().getBytes(), StandardCharsets.UTF_8)
            );

            CodeFile saved = codeFileRepository.save(codeFile);

            return reviewService.review(saved, model, focusSet);

        } catch (IOException e) {
            throw new RuntimeException("Error processing file", e);
        }
    }

    public AgentResponse analyze(AgentRequest request) {

        ReviewFocusDto focusDto = new ReviewFocusDto();
        focusDto.setFocus(request.getFocus());

        List<String> memory = memoryService.searchSummaries(
                request.getProjectId() != null
                        ? request.getProjectId()
                        : "default",
                3
        );

        System.out.println("Agent memory: { "+ memory.size());


        CodeFile codeFile = new CodeFile();
        codeFile.setFilename("inline-code");
        codeFile.setLanguage(request.getCode().getLanguage());
        codeFile.setContent(request.getCode().getCode());

        CodeFile saved = codeFileRepository.save(codeFile);

        EnumSet<ReviewFocus> focusSet =
                reviewFocusResolutionService.resolve(
                        focusDto != null ? focusDto.getFocus() : null
                );

        AnalysisResultDto result =
                reviewService.review(saved, request.getModel(), focusSet);

        AgentResponse response = new AgentResponse();
        response.setPlan(List.of("Analyze input", "Run AI review"));
        response.setResult(result);

        Set<String> focus = new HashSet<>();

        focus.add("test");

        System.out.println(response.getResult().toString());

        memoryService.saveSummary("default", "test", focus);


        return response;
    }



    public CodeFile saveCodeFile(CodeFileUploadDto request) {
        try {
            CodeFile codeFile = new CodeFile();
            codeFile.setFilename(request.getFile().getOriginalFilename());
            codeFile.setLanguage(request.getLanguageOvveride());
            codeFile.setContent(
                    new String(request.getFile().getBytes(), StandardCharsets.UTF_8)
            );

            return codeFileRepository.save(codeFile);
        } catch (IOException e) {
            throw new RuntimeException("Error reading uploaded file", e);
        }
    }
}
