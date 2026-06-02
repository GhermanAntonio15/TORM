package com.proiect.tpd.CodeAssist.dto;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class AIModelSelectionDto {
    @NotNull
    @Size(min = 1)
    private String model;
}
