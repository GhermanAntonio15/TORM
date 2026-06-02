package com.proiect.tpd.CodeAssist.dto;

import com.proiect.tpd.CodeAssist.model.ReviewFocus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CodeReviewRequestDto {

    private CodeFileUploadDto codeFile;
    private AIModelSelectionDto aiModel;
    private ReviewFocusDto reviewFocus;
}
