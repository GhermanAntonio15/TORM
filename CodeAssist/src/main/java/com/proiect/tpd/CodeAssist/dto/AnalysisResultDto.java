package com.proiect.tpd.CodeAssist.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AnalysisResultDto {

    private int score;
    private String summary;
    private List<String> issues;
    private List<String> suggestions;
}
