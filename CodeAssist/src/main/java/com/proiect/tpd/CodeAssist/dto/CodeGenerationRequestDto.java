package com.proiect.tpd.CodeAssist.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Setter
@Getter
public class CodeGenerationRequestDto {


    @NotNull
    @Size(min = 10, message = "Description must be at least 10 characters")
    private String description;

    @NotNull
    @Size(min = 1)
    private String model;

    private String target;
}
