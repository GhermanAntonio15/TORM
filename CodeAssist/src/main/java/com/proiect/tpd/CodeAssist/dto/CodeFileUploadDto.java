package com.proiect.tpd.CodeAssist.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Getter
@Setter
public class CodeFileUploadDto {

    @NotNull
    private MultipartFile file;

    //optional: to override
    private String languageOvveride;

}
