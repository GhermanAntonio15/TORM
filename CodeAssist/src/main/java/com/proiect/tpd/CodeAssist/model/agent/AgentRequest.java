package com.proiect.tpd.CodeAssist.model.agent;

import com.proiect.tpd.CodeAssist.dto.CodeFileUploadDto;
import com.proiect.tpd.CodeAssist.model.InlineCodeDto;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Getter
@Setter
public class AgentRequest {

    @NotNull
    @Valid
    private InlineCodeDto code;

    @NotBlank
    private String model;

    @NotEmpty
    private Set<@NotBlank String> focus;

    @Size(max = 100)
    private String projectId;
}



