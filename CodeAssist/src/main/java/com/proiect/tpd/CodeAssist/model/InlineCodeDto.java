package com.proiect.tpd.CodeAssist.model;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class InlineCodeDto {

    @NotBlank
    private String code;

    @NotBlank
    private String language;
}

