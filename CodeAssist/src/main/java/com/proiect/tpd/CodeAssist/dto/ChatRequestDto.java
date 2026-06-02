package com.proiect.tpd.CodeAssist.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Getter
@Setter
public class ChatRequestDto {

    @NotNull
    private String sessionId;

    @NotNull
    @Size(min = 1)
    private String message;

    @NotNull
    private String model;
}
