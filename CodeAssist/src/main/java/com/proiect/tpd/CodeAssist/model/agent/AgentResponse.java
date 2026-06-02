package com.proiect.tpd.CodeAssist.model.agent;

import com.proiect.tpd.CodeAssist.dto.AnalysisResultDto;
import lombok.Generated;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class AgentResponse {

    private List<String> plan;
    private AnalysisResultDto result;

    // getters & setters
}


